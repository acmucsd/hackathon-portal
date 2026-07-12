# Rules for writing unit tests ( for agents )

- Isolate each unit test case with their own describe and test block.
- For each unit test, describe the "When" in the describe block, and the "Then" in the test block.
  - For example: "When you call the admin endpoint as a user" -> "Then, you get a {result}"
- You should do all the arranging, acting, and asserting all within each unit test block, you should not be doing any arranging outside of each block.
- Only test public contracts, and we should avoid testing internal code implementation.
- Always make unit tests as simple as possible, test the smallest possible case that validates whatever were testing.
