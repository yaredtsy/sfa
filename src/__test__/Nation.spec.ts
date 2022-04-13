import { response } from "express";
import supertest from "supertest";
import app from "../app";

const request = supertest(app);
const url = "/api/v1.0/nations";

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
describe("Nation Route", () => {
  describe("Nation GET ALL", () => {
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

  describe("Nation GET ONE", () => {
    const resp = () => {
      return request.get(`${url}/1`).set("Authorization", `Bearer ${token}`);
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
        .get(`${url}/0`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });

    it("should return 401, access denied", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(401);
    });
  });

  describe("Nation PUT", () => {
    const resp = () => {
      return request
        .patch(`${url}/1`)
        .send({
          nationCode: "UT",
          nationName: "Updated Test",
        })
        .set("Authorization", `Bearer ${token}`);
    };
    const emptyObj = () => {
      return request
        .patch(`${url}/1`)
        .send({})
        .set("Authorization", `Bearer ${token}`);
    };
    const badData = () => {
      return request
        .patch(`${url}/1`)
        .send({
          nationCode: "UTE",
          nationName: "UPdated Test",
        })
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

    it("should return 400 BAD DATA, when empty objeect is sent", async () => {
      const response = await emptyObj();
      expect(response.status).toBe(400);
    });

    it("should return 400 BAD DATA, on bad data", async () => {
      const response = await badData();
      expect(response.status).toBe(400);
    });

    it("should return 404 NOT FOUND, on bad id", async () => {
      const response = await request
        .patch(`${url}/0`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });

    it("should return 401, access denied", async () => {
      const response = await request.patch(`${url}/1`).send({
        nationCode: "UT",
        nationName: "UPdated Test",
      });
      expect(response.status).toBe(401);
    });
  });

  describe("DELETE ID", () => {
    const resp = () => {
      return request.delete(`${url}/1`).set("Authorization", `Bearer ${token}`);
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
        .delete(`${url}/0`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });

    it("should return 401, ACESS DENIED", async () => {
      const response = await request.delete(`${url}/1`);
      expect(response.status).toBe(401);
    });
  });

  describe("Nation POST", () => {
    const postValid = () => {
      return request
        .post(url)
        .send({
          nationCode: "TN",
          nationName: "Test Nation",
        })
        .set("Authorization", `Bearer ${token}`);
    };
    const emptyObj = () => {
      return request.post(url).send({}).set("Authorization", `Bearer ${token}`);
    };
    const postInvalid = () => {
      return request
        .post(url)
        .send({
          nationCode: "TNe",
          nationName: "Test Nation",
        })
        .set("Authorization", `Bearer ${token}`);
    };
    const postWithoutToken = () => {
      return request.post(url).send({
        nationCode: "TN",
        nationName: "Test Nation",
      });
    };

    it("should return 201, ON successful insertion", async () => {
      const response = await postValid();
      expect(response.status).toBe(201);
    });

    it("should return 400 BAD DATA, when nationcode is not 2 chars", async () => {
      const response = await postInvalid();
      expect(response.status).toBe(400);
    });

    it("it shoudl return 400 BAD DATA, on empty object", async () => {
      const response = await emptyObj();
      expect(response.status).toBe(400);
    });

    it("should return 401 ACCESS DENIED", async () => {
      const response = await postWithoutToken();
      expect(response.status).toBe(401);
    });
  });
});
