import supertest from "supertest";
import { response, Response } from "express";
import { createConnection } from "typeorm";
import app from "../app";
import { User } from "../entity/User";

const request = supertest(app);

jest.useFakeTimers("legacy");
// const conn = createConnection().then((con) => {
//   con.connect();
//   return con;
// });

// beforeAll(async () => {
//   const c = await conn;
//   c.query("DELETE FROM user_detail WHERE id != 1");
//   c.close();
// });
describe("User Route", () => {
  const postValidUser = () => {
    return request.post("/api/v1.0/users").send({
      firstName: "t_fname",
      middleName: "t_mname",
      lastName: "t_lname",
      email: "test@emailv.com",
      phoneNumber: "0912340078",
      role: 1,
      address: "test address",
      position: "test position",
      password: "123abc",
    });
  };
  const postValidUser2 = () => {
    return request.post("/api/v1.0/users").send({
      firstName: "t_fname",
      middleName: "t_mname",
      lastName: "t_lname",
      email: "test@eail.com",
      phoneNumber: "912345078",
      role: 1,
      address: "test address",
      position: "test position",
      password: "123abc",
    });
  };

  const postRepeatedUser = () => {
    return request.post("/api/v1.0/users").send({
      firstName: "t_fname",
      middleName: "t_mname",
      lastName: "t_lname",
      email: "j@j.com",
      phoneNumber: "0912345078",
      role: 1,
      address: "test address",
      position: "test position",
      password: "123abc",
    });
  };
  const postBadData = () => {
    return request.post("/api/v1.0/users").send({
      firstName: "t_fname",
      middleName: "t_mname",
      lastName: "t_lname",
      email: "test@test.com",
      phoneNumber: "0912345678",
      role: 1,
      address: "test address",
      position: "test position",
    });
  };
  describe("User POST", () => {
    it("should return 201 when valid user register", (done) => {
      postValidUser().then((response: any) => {
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({});
        done();
      });
    });

    it("should return status code 409 when unique fields are repeated", async () => {
      const response = await postRepeatedUser();
      expect(response.status).toBe(409);
    });

    it("should return status code 400 when data is missing or bad data", async () => {
      const response = await postBadData();
      expect(response.status).toBe(400);
    });

    it("should hashpassword when storing to db", async () => {
      const response = await postValidUser2();
      expect(response.body.user.password).not.toBe("123abc");
    });
  });

  describe("UserRegister GET", () => {
    it("should return status code 200", async () => {
      const response = await request.get("/api/v1.0/users");
      return expect(response.status).toBe(200);
    });
    it("should return object relative to the id", (done) => {
      request.get("/api/v1.0/users").then((response) => {
        expect(response.body).toMatchObject({});
        done();
      });
    });
  });

  describe("User GET by id", () => {
    it("should return status code 200", (done) => {
      request.get("/api/v1.0/users/1").then((response) => {
        expect(response.status).toBe(200);
        done();
      });
    });

    it("should return object relative to the id", (done) => {
      request.get("/api/v1.0/users/1").then((response) => {
        expect(response.body).toMatchObject({});
        done();
      });
    });

    it("should return status code 404 for bad id", (done) => {
      request.get("/api/v1.0/users/111").then((response) => {
        expect(response.status).toBe(404);
        done();
      });
    });
  });

  describe("Users PUT/Patch request", () => {
    it("should return status code 200", (done) => {
      request
        .patch("/api/v1.0/users/1")
        .send({
          middleName: "Updated",
        })
        .then((response) => {
          expect(response.status).toBe(200);
          done();
        });
    });

    it("should return object relative to the id", (done) => {
      request.patch("/api/v1.0/users/1").then((response) => {
        expect(response.body).toMatchObject({});
        done();
      });
    });

    it("should return status code 404 for bad id", (done) => {
      request.patch("/api/v1.0/users/111").then((response) => {
        expect(response.status).toBe(404);
        done();
      });
    });
  });

  describe("Users DELETE request", () => {
    it("should return status code 202", (done) => {
      request.delete("/api/v1.0/users/1").then((response: any) => {
        expect(response.status).toBe(202);
        done();
      });
    });

    it("should return object relative to the id", (done) => {
      request.delete("/api/v1.0/users/1").then((response: any) => {
        expect(response.body).toMatchObject({});
        done();
      });
    });

    it("should return status code 404 for bad id", (done) => {
      request.delete("/api/v1.0/users/111").then((response: any) => {
        expect(response.status).toBe(404);
        done();
      });
    });
  });

  describe("User Login", () => {
    const valid = () => {
      return request.post("/api/v1.0/users/login").send({
        email: "j@j.com",
        password: "123abc",
      });
    };
    const inValid = () => {
      return request.post("/api/v1.0/users/login").send({
        email: "j@j.com",
        password: "123bca",
      });
    };
    const notFound = () => {
      return request.post("/api/v1.0/users/login").send({
        email: "test@none.com",
        password: "123bca",
      });
    };
    it("should return status code 200 OK, on valid input", async () => {
      const response = await valid();
      expect(response.status).toBe(200);
    });

    it("should return 400 bad data, on wrong email or password", async () => {
      const response = await inValid();
      expect(response.status).toBe(400);
    });
    it("should return 404 not Found, on bad data", async () => {
      const response = await notFound();
      expect(response.status).toBe(404);
    });

    it("should store jwt token on sucessful", async () => {
      const response = await valid();
      expect(response.body.token).toBeDefined();
    });
  });
});
