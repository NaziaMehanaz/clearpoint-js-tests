const request = require("supertest")("http://localhost:3002");

const { assert } = require("chai");
var uuid = require("uuid");
var myUUID = uuid.v4();

var description = "Item added via postman " + myUUID;
// 1. Create an item successfully. Assert it by fetching it via UUID of item
describe("1. create_an_item_201", () => {
  it("POST /api/todoItems", async function () {
    let itemUuid = null;
    const data = {
      description: JSON.stringify(description),
    };
    // create item
    await request
      .post("/api/todoItems")
      .send(data)
      .set("Content-type", "application/json")
      .set("Accept", "application/json")
      .expect(201)
      .then((res) => {
        itemUuid = res.body;
      });

    // assert created item
    return request
      .get("/api/todoItems/" + itemUuid)
      .expect(200)
      .then((res) => {
        assert.equal(
          res.body.description.toString().replaceAll('"', ""),
          description
        );
      });
  });
});

// 2. create item with same description as above, that will result in conflict
describe("2. create_an_item_409", () => {
  it("POST /api/todoItems", async function () {
    let itemUuid = null;
    const data = {
      description: JSON.stringify(description),
    };
    // create item
    await request
      .post("/api/todoItems")
      .send(data)
      .set("Content-type", "application/json")
      .set("Accept", "application/json")
      .expect(409)
      .then((res) => {
        assert.equal(res.body, "A todo item with description already exists");
      });
  });
});

// 3. bad request when creating item
describe("3. create_an_item_400", () => {
  it("POST /api/todoItems", async function () {
    let itemUuid = null;
    const data = {
      description: "",
    };
    // create item with no description
    await request
      .post("/api/todoItems")
      .send(data)
      .set("Content-type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then((res) => {
        assert.equal(
          res.body.errors.Description[0],
          "Description field can not be empty"
        );
      });
  });
});
