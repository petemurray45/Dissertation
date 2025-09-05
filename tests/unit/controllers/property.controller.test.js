// tests/unit/controllers/property.controller.test.js
import {
  jest,
  describe,
  it,
  beforeEach,
  beforeAll,
  afterAll,
  expect,
} from "@jest/globals";

// mock modules before importing controller
jest.unstable_mockModule("../../../backend/config/db.js", () => ({
  sql: jest.fn(),
}));

jest.unstable_mockModule("axios", () => ({
  default: {
    get: jest.fn(),
  },
}));

jest.unstable_mockModule("../../../backend/utils/sendEmail.js", () => ({
  sendEnquiryConfirmation: jest.fn(),
}));

let sql, axios, sendEnquiryConfirmation;
let controller;

let {
  getAllProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
  getPropertiesWithTravelTime,
  getPlaces,
  insertEnquiries,
  getEnquiries,
  searchWithRadius,
} = {}; // filled in before all

beforeAll(async () => {
  ({ sql } = await import("../../../backend/config/db.js"));
  axios = (await import("axios")).default;
  ({ sendEnquiryConfirmation } = await import(
    "../../../backend/utils/sendEmail.js"
  ));
  controller = await import(
    "../../../backend/controllers/propertyControllers.js"
  );

  ({
    getAllProperties,
    createProperty,
    getProperty,
    updateProperty,
    deleteProperty,
    getPropertiesWithTravelTime,
    getPlaces,
    insertEnquiries,
    getEnquiries,
    searchWithRadius,
  } = controller);
});

// helper to mock res
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
  res.sendStatus = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  return res;
}

describe("property controller", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    sql.mockReset();
    axios.get.mockReset();
    process.env = {
      ...OLD_ENV,
      GOOGLE_MAPS_API_KEY: "gmaps-key",
    };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  // getAllProperties
  it("getAllProperties returns paged properties with images", async () => {
    // first parallel call returns properties and count

    sql.mockImplementationOnce(() => "__frag__");
    sql.mockResolvedValueOnce([
      // select properties join agencies
      { id: 1, title: "room a", agency_name: "propco", logo_url: "logo.png" },
      { id: 2, title: "room b", agency_name: "propco", logo_url: "logo.png" },
    ]);
    sql.mockResolvedValueOnce([{ count: 2 }]);

    // images by property id
    sql.mockResolvedValueOnce([
      { property_id: 1, image_url: "a1.jpg" },
      { property_id: 1, image_url: "a2.jpg" },
      { property_id: 2, image_url: "b1.jpg" },
    ]);

    const req = { query: { page: 1, limit: 6 } };
    const res = createRes();

    await getAllProperties(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalCount).toBe(2);
    expect(res.body.data).toEqual([
      {
        id: 1,
        title: "room a",
        agency_name: "propco",
        logo_url: "logo.png",
        imageUrls: ["a1.jpg", "a2.jpg"],
      },
      {
        id: 2,
        title: "room b",
        agency_name: "propco",
        logo_url: "logo.png",
        imageUrls: ["b1.jpg"],
      },
    ]);
  });

  it("getAllProperties handles error", async () => {
    const req = { query: {} };
    const res = createRes();

    await getAllProperties(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });

  // createProperty
  it("createProperty validates required fields", async () => {
    const req = {
      auth: { role: "agent", agencyId: 9 },
      body: { title: "", images: [] }, // trigger missing fields
    };
    const res = createRes();

    await createProperty(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("createProperty inserts property and images", async () => {
    sql
      // insert property returning id
      .mockResolvedValueOnce([{ id: 42 }])
      // insert image one
      .mockResolvedValueOnce(undefined)
      // insert image two
      .mockResolvedValueOnce(undefined);

    const req = {
      auth: { role: "agent", agencyId: 2 },
      body: {
        title: "new room",
        description: "nice",
        price_per_month: 800,
        propertyType: "Flat",
        ensuite: "Yes",
        bedType: "Double",
        wifi: "Yes",
        pets: "No",
        location: "belfast",
        latitude: 54.5,
        longitude: -5.9,
        images: ["u1.jpg", "u2.jpg"],
      },
    };
    const res = createRes();

    await createProperty(req, res);

    expect(sql).toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // getProperty
  it("getProperty returns property with images", async () => {
    sql
      // property with agency join
      .mockResolvedValueOnce([
        { id: 5, title: "nice", agency_name: "acme", logo_url: "l.png" },
      ])
      // images for property
      .mockResolvedValueOnce([
        { image_url: "p1.jpg" },
        { image_url: "p2.jpg" },
      ]);

    const req = { params: { id: 5 } };
    const res = createRes();

    await getProperty(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual({
      id: 5,
      title: "nice",
      agency_name: "acme",
      logo_url: "l.png",
      images: ["p1.jpg", "p2.jpg"],
    });
  });

  it("getProperty handles error", async () => {
    sql.mockRejectedValueOnce(new Error("x"));
    const req = { params: { id: 7 } };
    const res = createRes();

    await getProperty(req, res);

    expect(res.statusCode).toBe(500);
  });

  // updateProperty
  it("updateProperty forbids when agent does not own property", async () => {
    // fetch agency for property shows different id
    sql.mockResolvedValueOnce([{ agency_id: 2 }]); // caller has agencyId 1
    const req = {
      auth: { role: "agent", agencyId: 1 },
      params: { id: 10 },
      body: {},
    };
    const res = createRes();

    await updateProperty(req, res);

    expect(res.statusCode).toBe(403);
  });

  it("updateProperty updates property and images", async () => {
    // role admin skips ownership check
    // update returning row
    sql
      .mockResolvedValueOnce([{ id: 10, title: "updated" }]) // update properties returning
      // delete images keep only existingImageUrls
      .mockResolvedValueOnce(undefined)
      // insert new images
      .mockResolvedValueOnce(undefined);

    const req = {
      auth: { role: "admin" },
      params: { id: 10 },
      body: {
        title: "updated",
        description: "d",
        price_per_month: 900,
        propertyType: "Flat",
        ensuite: true,
        bedType: "Double",
        wifi: true,
        pets: false,
        location: "belfast",
        latitude: 1,
        longitude: 2,
        existingImageUrls: ["keep.jpg"],
        newImageUrls: ["new1.jpg", "new2.jpg"],
      },
    };
    const res = createRes();

    await updateProperty(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({ id: 10, title: "updated" });
  });

  // deleteProperty
  it("deleteProperty forbids when agent does not own property", async () => {
    sql.mockResolvedValueOnce([{ agency_id: 9 }]); // caller is 1
    const req = { auth: { role: "agent", agencyId: 1 }, params: { id: 33 } };
    const res = createRes();

    await deleteProperty(req, res);

    expect(res.statusCode).toBe(403);
  });

  it("deleteProperty deletes and returns deleted row", async () => {
    // role admin skips ownership check
    sql.mockResolvedValueOnce([{ id: 33, title: "x" }]); // delete returning row
    const req = { auth: { role: "admin" }, params: { id: 33 } };
    const res = createRes();

    await deleteProperty(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual({ id: 33, title: "x" });
  });

  // getPropertiesWithTravelTime
  it("getPropertiesWithTravelTime returns travel time grid", async () => {
    // properties list
    sql.mockResolvedValueOnce([
      { id: 1, latitude: 54.6, longitude: -5.9, title: "a" },
      { id: 2, latitude: 54.61, longitude: -5.91, title: "b" },
    ]);
    // images join
    sql.mockResolvedValueOnce([
      { property_id: 1, image_url: "a1.jpg" },
      { property_id: 2, image_url: "b1.jpg" },
    ]);

    // directions calls two properties x one destination x one mode
    axios.get
      .mockResolvedValueOnce({
        data: { routes: [{ legs: [{ duration: { text: "22 min" } }] }] },
      })
      .mockResolvedValueOnce({
        data: { routes: [{ legs: [{ duration: { text: "30 min" } }] }] },
      });

    const req = {
      body: {
        destinations: [{ latitude: 54.58, longitude: -5.93, label: "qub" }],
        modes: ["DRIVING"],
      },
    };
    const res = createRes();

    await getPropertiesWithTravelTime(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].travelTimes[0]).toEqual({
      destination: "qub",
      mode: "driving",
      duration: "22 min",
    });
  });

  it("getPropertiesWithTravelTime validates destinations", async () => {
    const req = { body: { destinations: [] } };
    const res = createRes();

    await getPropertiesWithTravelTime(req, res);

    expect(res.statusCode).toBe(400);
  });

  // getPlaces
  it("getPlaces returns mapped places", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            place_id: "p1",
            name: "botanic gardens",
            rating: 4.5,
            user_ratings_total: 1200,
            vicinity: "belfast",
            types: ["park"],
            photos: [{ photo_reference: "abc" }],
          },
        ],
      },
    });

    const req = { query: { lat: "54.58", lng: "-5.93", type: "park" } };
    const res = createRes();

    await getPlaces(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.places[0]).toMatchObject({
      place_id: "p1",
      name: "botanic gardens",
    });
  });

  it("getPlaces validates lat lng", async () => {
    const req = { query: { lat: "", lng: "" } };
    const res = createRes();

    await getPlaces(req, res);

    expect(res.statusCode).toBe(400);
  });

  // insertEnquiries
  it("insertEnquiries validates fields", async () => {
    const req = { body: {} };
    const res = createRes();

    await insertEnquiries(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("insertEnquiries inserts and sends email", async () => {
    // fetch property to get agency
    sql
      .mockResolvedValueOnce([{ agency_id: 7, location: "belfast" }])
      // insert enquiry returning row
      .mockResolvedValueOnce([{ id: 99, message: "msg" }]);

    const req = {
      body: {
        property_id: 1,
        full_name: "alex",
        email: "a@b.com",
        message: "hello",
        user_id: null,
      },
      auth: { role: "user", userId: 123 },
    };
    const res = createRes();

    await insertEnquiries(req, res);

    expect(res.statusCode).toBe(201);
    expect(sendEnquiryConfirmation).toHaveBeenCalledWith(
      "a@b.com",
      "alex",
      "belfast"
    );
  });

  // getEnquiries
  it("getEnquiries for admin returns all", async () => {
    sql.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
    const req = { auth: { role: "admin" } };
    const res = createRes();

    await getEnquiries(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("getEnquiries for agent filters by agency", async () => {
    sql.mockResolvedValueOnce([{ id: 7 }]);
    const req = { auth: { role: "agent", agencyId: 5 } };
    const res = createRes();

    await getEnquiries(req, res);

    expect(res.statusCode).toBe(200);
    expect(sql).toHaveBeenCalled();
  });

  it("getEnquiries for user requires id and returns own", async () => {
    sql.mockResolvedValueOnce([{ id: 3 }]);
    const req = { auth: { role: "user", userId: 12 } };
    const res = createRes();

    await getEnquiries(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([{ id: 3 }]);
  });

  it("getEnquiries returns 403 for unknown role", async () => {
    const req = { auth: {} };
    const res = createRes();

    await getEnquiries(req, res);

    expect(res.statusCode).toBe(403);
  });

  // searchWithRadius
  it("searchWithRadius validates params", async () => {
    const req = { query: {} };
    const res = createRes();

    await searchWithRadius(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("searchWithRadius returns properties with images", async () => {
    sql.mockReset();

    // 3 filter fragments + 2 reduce combines = 5 calls to soak
    sql
      .mockImplementationOnce(() => "__frag__")
      .mockImplementationOnce(() => "__frag__")
      .mockImplementationOnce(() => "__frag__")
      .mockImplementationOnce(() => "__frag__")
      .mockImplementationOnce(() => "__frag__")
      // main select
      .mockResolvedValueOnce([
        { id: 10, title: "r1", distance: 1.1 },
        { id: 11, title: "r2", distance: 2.2 },
      ])
      // images select
      .mockResolvedValueOnce([
        { property_id: 10, image_url: "10a.jpg" },
        { property_id: 11, image_url: "11a.jpg" },
      ]);

    const req = {
      query: {
        lat: "54.58",
        lng: "-5.93",
        radius: "5",
        minPrice: "500",
        maxPrice: "1000",
      },
    };
    const res = createRes();

    await searchWithRadius(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { id: 10, title: "r1", distance: 1.1, imageUrls: ["10a.jpg"] },
      { id: 11, title: "r2", distance: 2.2, imageUrls: ["11a.jpg"] },
    ]);
  });
});
