import { response } from "express";
import supertest from "supertest";
import app from "../app";
const request = supertest(app);
let url = "/api/v1.0/regions";

let token;

beforeAll(async () => {
  const valid = () => {
    return request.post("/api/v1.0/users/login").send({
      email: "j@j.com",
      password: "123abc",
    });
  };

  const response = await valid();
  token = response.body.token;
});
describe("Region Route", () => {
  describe("Region GET ALL", () => {
    it("should return 200 OK", async () => {
      const response = await request
        .get(url)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it("should return object", async () => {
      const response = await request
        .get(url)
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toMatchObject({});
    });

    it("should return 401, access denied", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(401);
    });
  });

  describe("Region GET ONE", () => {
    const resp = () => {
      return request.get(url + "/1").set("Authorization", `Bearer ${token}`);
    };
    it("should return 200 OK, on valid id", async () => {
      const response = await resp();
      expect(response.status).toBe(200);
    });

    it("should return object", async () => {
      const response = await resp();
      expect(response.body).toMatchObject({});
    });

    it("should return 404 NOT FOUND, on bad id", async () => {
      const response = await request
        .get(url + "/0")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });

    it("should return 401, access denied", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(401);
    });
  });

  describe("Region PUT", () => {
    const resp = () => {
      return request
        .patch(url + "/1")
        .send({
          company_id: 1,
          regionCode: "AA",
          regionName: "Addis Ababa"
        })
        .set("Authorization", `Bearer ${token}`);
    };
    const badData = () => {
      return request
        .patch(url + "/1")
        .send({})
        .set("Authorization", `Bearer ${token}`);
    };
    it("should return 200 OK, on valid id and data", async () => {
      const response = await resp();
      expect(response.status).toBe(200);
    });

    it("should return object", async () => {
      const response = await resp();
      expect(response.body).toMatchObject({});
    });

    it("should return 400 BAD DATA, on bad data", async () => {
      const response = await badData();
      expect(response.status).toBe(400);
    });

    it("should return 404 NOT FOUND, on bad id", async () => {
      const response = await request
        .patch(url + "/0")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });

    it("should return 401, access denied", async () => {
      const response = await request.patch(url + "/1").send({
        nationCode: "UT",
        nationName: "UPdated Test",
      });
      expect(response.status).toBe(401);
    });
  });

  describe("Region DELETE ID", () => {
    const resp = () => {
      return request.delete(url + "/1").set("Authorization", `Bearer ${token}`);
    };
    it("should return 202", async () => {
      const response = await resp();
      expect(response.status).toBe(202);
    });

    it("should return object", async () => {
      const response = await resp();
      expect(response.body).toMatchObject({});
    });

    it("should return 404 NOT FOUND, on bad id", async () => {
      const response = await request
        .delete(url + "/0")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });

    it("should return 401, ACESS DENIED", async () => {
      const response = await request.delete(url + "/1");
      expect(response.status).toBe(401);
    });
  });

  describe("Company POST", () => {
    const postValid = () => {
      return request
        .post(url)
        .send({
          company_id: 1,
          regionCode: "AA",
          regionName: "Addis Ababa",
          
        })
        .set("Authorization", `Bearer ${token}`);
    };
    const postInvalid = () => {
      return request
        .post(url)
        .send({})
        .set("Authorization", `Bearer ${token}`);
    };
    const postWithoutToken = () => {
      return request.post(url).send({
        nation_id: 1,
          city: "Addis Ababa",
          address: "test Address",
          numberOfAgents: 70
      });
    };

    it("should return 201, ON successful insertion", async () => {
      const response = await postValid();
      expect(response.status).toBe(201);
    });

    it("should return 400 BAD DATA, on BAD Data", async () => {
      const response = await postInvalid();
      expect(response.status).toBe(400);
    });

    it("should return 401 ACCESS DENIED", async () => {
      const response = await postWithoutToken();
      expect(response.status).toBe(401);
    });
  });
});
