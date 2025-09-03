// tests/unit/controllers/chat.controller.test.js
import {
  jest,
  describe,
  it,
  beforeEach,
  afterAll,
  expect,
} from "@jest/globals";

// mock setup
let createCompletionMock;

// mock openai client returns an object with chat completions create
jest.unstable_mockModule("openai/client.js", () => {
  createCompletionMock = jest.fn();
  class OpenAI {
    constructor() {
      return {
        chat: {
          completions: {
            create: createCompletionMock,
          },
        },
      };
    }
  }
  return { OpenAI };
});

// mock sql and axios
jest.unstable_mockModule("../../../backend/config/db.js", () => ({
  sql: jest.fn(),
}));
jest.unstable_mockModule("axios", () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// import mocks and controller under test after mocks
const { sql } = await import("../../../backend/config/db.js");
const axios = (await import("axios")).default;
const { botChat } = await import(
  "../../../backend/controllers/chatController.js"
);

// helper for express style res object
function createRes() {
  const res = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn((payload) => {
    res.body = payload;
    return res;
  });
  return res;
}

describe("chat controller botChat", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    sql.mockReset();
    jest.clearAllMocks();
    process.env = {
      ...OLD_ENV,
      OPENAI_API_KEY: "test-openai",
      GOOGLE_MAPS_API_KEY: "gmaps-key",
    };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("handles tool call with travel time and returns filtered properties", async () => {
    createCompletionMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            tool_calls: [
              {
                function: {
                  name: "search_properties",
                  arguments: JSON.stringify({
                    travelTimeto: "Queens University Belfast",
                    maxTravelTimeMinutes: 30,
                  }),
                },
              },
            ],
          },
        },
      ],
    });

    axios.get.mockResolvedValueOnce({
      data: {
        results: [{ geometry: { location: { lat: 54.584, lng: -5.936 } } }],
      },
    });

    axios.post.mockResolvedValueOnce({
      data: [
        { id: 1, travelTimes: [{ duration: "22 min" }] },
        { id: 2, travelTimes: [{ duration: "45 min" }] },
        { id: 3, travelTimes: [{ duration: "1 hour 10 min" }] },
        { id: 4, travelTimes: [{ duration: "18 min" }] },
      ],
    });

    const req = { body: { message: "show me rooms within 30 minutes of qub" } };
    const res = createRes();

    await botChat(req, res);

    expect(createCompletionMock).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body.reply).toMatch(/within 30 minutes/i);
    expect(res.body.properties.map((p) => p.id)).toEqual([1, 4]);
  });

  it("returns message if geocode finds no location", async () => {
    createCompletionMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            tool_calls: [
              {
                function: {
                  name: "search_properties",
                  arguments: JSON.stringify({
                    travelTimeto: "nowhere land",
                    maxTravelTimeMinutes: 20,
                  }),
                },
              },
            ],
          },
        },
      ],
    });

    axios.get.mockResolvedValueOnce({
      data: { results: [] },
    });

    const req = { body: { message: "20 minutes to nowhere land" } };
    const res = createRes();

    await botChat(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.reply).toMatch(/couldn't find that location/i);
    expect(res.body.properties).toEqual([]);
  });

  it("does database search when tool call has filters but no travel time", async () => {
    // openai tool call with filters
    createCompletionMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            tool_calls: [
              {
                function: {
                  name: "search_properties",
                  arguments: JSON.stringify({
                    location: "belfast",
                    maxPrice: 900,
                    ensuite: true,
                  }),
                },
              },
            ],
          },
        },
      ],
    });

    // make sql return rows only for the two real selects
    sql.mockReset();
    sql.mockImplementation((strings, ...values) => {
      const text = Array.isArray(strings) ? strings.join(" ") : String(strings);

      if (
        text.includes("SELECT * FROM properties") &&
        text.includes("ORDER BY price_per_month ASC")
      ) {
        return [
          { id: 10, title: "room a", price_per_month: 800 },
          { id: 11, title: "room b", price_per_month: 850 },
        ];
      }

      if (
        text.includes("SELECT property_id, image_url FROM images") &&
        text.includes("ORDER BY")
      ) {
        return [
          { property_id: 10, image_url: "img-10a.jpg" },
          { property_id: 10, image_url: "img-10b.jpg" },
          { property_id: 11, image_url: "img-11a.jpg" },
        ];
      }

      // for filter fragments and any other calls, return a harmless token
      return "__frag__";
    });

    const req = {
      body: { message: "find ensuite rooms in belfast under 900" },
    };
    const res = createRes();

    await botChat(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.reply).toMatch(/match your search/i);
    expect(res.body.properties).toEqual([
      {
        id: 10,
        title: "room a",
        price_per_month: 800,
        imageUrls: ["img-10a.jpg", "img-10b.jpg"],
      },
      {
        id: 11,
        title: "room b",
        price_per_month: 850,
        imageUrls: ["img-11a.jpg"],
      },
    ]);
  });

  it("falls back to assistant reply when no tool call", async () => {
    createCompletionMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: "hello how can i help you",
          },
        },
      ],
    });

    const req = { body: { message: "hi" } };
    const res = createRes();

    await botChat(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      reply: "hello how can i help you",
      properties: [],
    });
    expect(sql).not.toHaveBeenCalled();
    expect(axios.get).not.toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("returns 500 on unexpected error", async () => {
    createCompletionMock.mockRejectedValueOnce(new Error("openai down"));

    const req = { body: { message: "anything" } };
    const res = createRes();

    await botChat(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body).toEqual({ error: "Failed to generate response" });
  });
});
