// Import the functions to test
const { sendData, getData } = require("./UploadController.js") // Update the path accordingly

// Mock the database pool
jest.mock("../config/database.js", () => ({
  query: jest.fn()
}))

// Import the mocked pool
const pool = require("../config/database.js")

describe("sendData function", () => {
  it("should insert data into the database", async () => {
    // Mock request and response objects
    const req = {
      body: {
        data: [
          { '"id"': '"1"', '"postId"': '"1"', '"name"': '"John"', '"email"': '"john@example.com"', '"body"': '"Hello"' },
          { '"id"': '"2"', '"postId"': '"2"', '"name"': '"Jane"', '"email"': '"jane@example.com"', '"body"': '"Hi"' }
        ]
      }
    }
    const res = {
      json: jest.fn()
    }

    // Mock the query method of the pool
    pool.query.mockResolvedValueOnce(true)

    // Call the function
    await sendData(req, res)

    // Assertions
    expect(pool.query).toHaveBeenCalledTimes(2) // Assuming there are two data objects
    expect(res.json).not.toHaveBeenCalledWith({ error: true })
  })

  it("should handle errors gracefully", async () => {
    // Mock request and response objects
    const req = {
      body: {
        data: [{ '"id"': '"1"', '"postId"': '"1"', '"name"': '"John"', '"email"': '"john@example.com"', '"body"': '"Hello"' }]
      }
    }
    const res = {
      json: jest.fn()
    }

    // Mock the query method of the pool to throw an error
    pool.query.mockRejectedValueOnce(new Error("Database error"))

    // Call the function
    await sendData(req, res)

    // Assertions
    expect(res.json).toHaveBeenCalledWith({ error: true })
  })
})

describe("getData function", () => {
  it("should retrieve data from the database", async () => {
    // Mock request and response objects
    const req = {}
    const res = {
      json: jest.fn()
    }

    // Mock the query method of the pool
    pool.query.mockResolvedValueOnce([
      { id: 1, name: "John" },
      { id: 2, name: "Jane" }
    ])

    // Call the function
    await getData(req, res)

    // Assertions
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: "John" },
      { id: 2, name: "Jane" }
    ])
  })

  it("should handle errors gracefully", async () => {
    // Mock request and response objects
    const req = {}
    const res = {
      json: jest.fn()
    }

    // Mock the query method of the pool to throw an error
    pool.query.mockRejectedValueOnce(new Error("Database error"))

    // Call the function
    await getData(req, res)

    // Assertions
    expect(res.json).toHaveBeenCalledWith({ error: true })
  })
})
