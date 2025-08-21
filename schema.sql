--
-- PostgreSQL database dump
--

\restrict 5STcGUfI3oR6RqxMjoCqSAaJkPoc1TUMOzH4Lod9FjYXSxaWgEpztxdYlRN8u2B

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: propertydb_owner
--

CREATE SCHEMA neon_auth;


ALTER SCHEMA neon_auth OWNER TO propertydb_owner;

--
-- Name: bed_type_enum; Type: TYPE; Schema: public; Owner: propertydb_owner
--

CREATE TYPE public.bed_type_enum AS ENUM (
    'Double',
    'Single',
    'Bunk-Bed',
    'Queen',
    'King'
);


ALTER TYPE public.bed_type_enum OWNER TO propertydb_owner;

--
-- Name: property_type_enum; Type: TYPE; Schema: public; Owner: propertydb_owner
--

CREATE TYPE public.property_type_enum AS ENUM (
    'Detached',
    'Semi-Detached',
    'Terrace',
    'Bungalow',
    'Flat',
    'Cottage'
);


ALTER TYPE public.property_type_enum OWNER TO propertydb_owner;

--
-- Name: property_type_enum1; Type: TYPE; Schema: public; Owner: propertydb_owner
--

CREATE TYPE public.property_type_enum1 AS ENUM (
    'Detached',
    'Semi Detached',
    'Terraced',
    'Bungalow',
    'Flat',
    'Cottage'
);


ALTER TYPE public.property_type_enum1 OWNER TO propertydb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users_sync; Type: TABLE; Schema: neon_auth; Owner: propertydb_owner
--

CREATE TABLE neon_auth.users_sync (
    raw_json jsonb NOT NULL,
    id text GENERATED ALWAYS AS ((raw_json ->> 'id'::text)) STORED NOT NULL,
    name text GENERATED ALWAYS AS ((raw_json ->> 'display_name'::text)) STORED,
    email text GENERATED ALWAYS AS ((raw_json ->> 'primary_email'::text)) STORED,
    created_at timestamp with time zone GENERATED ALWAYS AS (to_timestamp((trunc((((raw_json ->> 'signed_up_at_millis'::text))::bigint)::double precision) / (1000)::double precision))) STORED,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE neon_auth.users_sync OWNER TO propertydb_owner;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: propertydb_owner
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admins OWNER TO propertydb_owner;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: propertydb_owner
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO propertydb_owner;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: propertydb_owner
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: agencies; Type: TABLE; Schema: public; Owner: propertydb_owner
--

CREATE TABLE public.agencies (
    id integer NOT NULL,
    agency_name character varying(255) NOT NULL,
    agency_email character varying(255) NOT NULL,
    login_id_hash text NOT NULL,
    phone character varying(50),
    logo_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    website text
);


ALTER TABLE public.agencies OWNER TO propertydb_owner;

--
-- Name: agencies_id_seq; Type: SEQUENCE; Schema: public; Owner: propertydb_owner
--

CREATE SEQUENCE public.agencies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agencies_id_seq OWNER TO propertydb_owner;

--
-- Name: agencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: propertydb_owner
--

ALTER SEQUENCE public.agencies_id_seq OWNED BY public.agencies.id;


--
-- Name: enquiries; Type: TABLE; Schema: public; Owner: propertydb_owner
--

CREATE TABLE public.enquiries (
    id integer NOT NULL,
    property_id integer,
    user_id integer,
    full_name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    agency_id integer,
    status text DEFAULT 'pending'::text NOT NULL
);


ALTER TABLE public.enquiries OWNER TO propertydb_owner;

--
-- Name: enquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: propertydb_owner
--

CREATE SEQUENCE public.enquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enquiries_id_seq OWNER TO propertydb_owner;

--
-- Name: enquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: propertydb_owner
--

ALTER SEQUENCE public.enquiries_id_seq OWNED BY public.enquiries.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: propertydb_owner
--

CREATE TABLE public.images (
    id integer NOT NULL,
    property_id integer,
    image_url text NOT NULL
);


ALTER TABLE public.images OWNER TO propertydb_owner;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: propertydb_owner
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.images_id_seq OWNER TO propertydb_owner;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: propertydb_owner
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: likes; Type: TABLE; Schema: public; Owner: propertydb_owner
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    user_id integer,
    property_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.likes OWNER TO propertydb_owner;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: propertydb_owner
--

CREATE SEQUENCE public.likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.likes_id_seq OWNER TO propertydb_owner;

--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: propertydb_owner
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- Name: notes; Type: TABLE; Schema: public; Owner: propertydb_owner
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    property_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notes OWNER TO propertydb_owner;

--
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: propertydb_owner
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notes_id_seq OWNER TO propertydb_owner;

--
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: propertydb_owner
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: propertydb_owner
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    title character varying(150) NOT NULL,
    description text,
    price_per_month numeric(10,2),
    location character varying(255),
    latitude double precision,
    longitude double precision,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    bed_type public.bed_type_enum,
    ensuite boolean NOT NULL,
    wifi boolean NOT NULL,
    pets boolean NOT NULL,
    property_type public.property_type_enum1,
    agency_id integer
);


ALTER TABLE public.properties OWNER TO propertydb_owner;

--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: propertydb_owner
--

CREATE SEQUENCE public.properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.properties_id_seq OWNER TO propertydb_owner;

--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: propertydb_owner
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- Name: search_history; Type: TABLE; Schema: public; Owner: propertydb_owner
--

CREATE TABLE public.search_history (
    id integer NOT NULL,
    user_id integer,
    query text,
    searched_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.search_history OWNER TO propertydb_owner;

--
-- Name: search_history_id_seq; Type: SEQUENCE; Schema: public; Owner: propertydb_owner
--

CREATE SEQUENCE public.search_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.search_history_id_seq OWNER TO propertydb_owner;

--
-- Name: search_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: propertydb_owner
--

ALTER SEQUENCE public.search_history_id_seq OWNED BY public.search_history.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: propertydb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying(100),
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    photo_url text
);


ALTER TABLE public.users OWNER TO propertydb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: propertydb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO propertydb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: propertydb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: agencies id; Type: DEFAULT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.agencies ALTER COLUMN id SET DEFAULT nextval('public.agencies_id_seq'::regclass);


--
-- Name: enquiries id; Type: DEFAULT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.enquiries ALTER COLUMN id SET DEFAULT nextval('public.enquiries_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- Name: properties id; Type: DEFAULT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- Name: search_history id; Type: DEFAULT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.search_history ALTER COLUMN id SET DEFAULT nextval('public.search_history_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_sync users_sync_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: propertydb_owner
--

ALTER TABLE ONLY neon_auth.users_sync
    ADD CONSTRAINT users_sync_pkey PRIMARY KEY (id);


--
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- Name: agencies agencies_agency_email_key; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.agencies
    ADD CONSTRAINT agencies_agency_email_key UNIQUE (agency_email);


--
-- Name: agencies agencies_pkey; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.agencies
    ADD CONSTRAINT agencies_pkey PRIMARY KEY (id);


--
-- Name: enquiries enquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: likes likes_user_id_property_id_key; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_property_id_key UNIQUE (user_id, property_id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: search_history search_history_pkey; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_sync_deleted_at_idx; Type: INDEX; Schema: neon_auth; Owner: propertydb_owner
--

CREATE INDEX users_sync_deleted_at_idx ON neon_auth.users_sync USING btree (deleted_at);


--
-- Name: enquiries enquiries_agency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.agencies(id) ON DELETE SET NULL;


--
-- Name: enquiries enquiries_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: enquiries enquiries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: images images_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: likes likes_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notes notes_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: notes notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: properties properties_agency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.agencies(id) ON DELETE SET NULL;


--
-- Name: properties properties_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: search_history search_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: propertydb_owner
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict 5STcGUfI3oR6RqxMjoCqSAaJkPoc1TUMOzH4Lod9FjYXSxaWgEpztxdYlRN8u2B

