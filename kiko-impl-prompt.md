You are an agentic AI that needs to implement a function-calling integration with my local `notes-web` application. 

The server is already running locally at `http://localhost:5000/api/v1`. You do not need to clone any repositories or start any servers. Your task is to write the Python code that defines the tools (function calling schemas) and the execution logic to perform CRUD operations on my notes.

### 1. Authentication Mechanics
The API uses a strict Dual-Auth system. Since you are an external bot, you will authenticate using a plaintext API Key. 
- You MUST pass the API key in the headers of every request.
- Header format: `{'x-api-key': 'YOUR_RAW_API_KEY'}`
- Assume the user will provide this API key to you via an environment variable or configuration file (e.g., `os.getenv('NOTES_API_KEY')`).

### 2. The API Endpoints
You need to implement four primary tool functions using the `requests` library.

**1. `get_notes()`**
- **Method**: `GET /notes`
- **Description**: Fetches all notes associated with your API key.
- **Response**: Returns a JSON array of note objects. Each object contains `_id`, `title`, `content`, and `theme`.

**2. `create_note(title, content)`**
- **Method**: `POST /notes`
- **Description**: Creates a new note. 
- **Payload**: JSON containing `{"title": string, "content": string, "theme": "string"}`. (The `theme` field exists in the DB, just pass the string "string" or leave it blank if optional).
- **Response**: Returns the newly created note object (including its `_id`).

**3. `update_note(note_id, title=None, content=None)`**
- **Method**: `PUT /notes/{id}`
- **Description**: Updates an existing note by its `_id`. 
- **Payload**: JSON containing fields to update (e.g., `{"content": "new text"}`). The backend uses Mongoose `findOneAndUpdate()`, so this will mutate the exact database row and completely overwrite the provided fields. It does NOT append. You must pass the full updated string.
- **Response**: Returns the updated note object.

**4. `delete_note(note_id)`**
- **Method**: `DELETE /notes/{id}`
- **Description**: Deletes a note by its `_id`.
- **Response**: Returns `{"message": "Note deleted"}`.

### 3. Payload Quirks & Markdown Handling (CRITICAL)
When sending the `content` field via POST or PUT, you must understand how the system parses text:
- **Raw Markdown is Supported**: You do NOT need to convert your output to HTML. Send raw markdown strings (e.g., `# Header\n- List item`). The frontend has a mechanical intercept that automatically detects raw markdown strings and parses them into an HTML Abstract Syntax Tree before feeding them to the rich text UI engine.
- **Strict JSON Parsing**: The Express backend uses strict ECMAScript `JSON.parse()`. You must ensure that `requests.post(url, json=payload)` or `json.dumps()` is used so that physical newlines (`\n`) and quotes inside the markdown are properly escaped. Do not manually construct JSON strings, or you will trigger a `SyntaxError: Bad control character`.
- **Formatting Guidelines**: When generating the Markdown for the `content` field, refer to the `AI_WRITER_GUIDE.md` rules. You can use standard Markdown, HTML tables, and Task Lists (`- [ ]`). Standard Markdown images are supported but will stretch to 100% width, so use `<img src="..." width="400" />` if you need custom sizing.

### 4. Implementation Task
Please write the Python implementation for this integration. Include the following:
1. **API Client Class**: A Python class using the `requests` library that initializes with the API key and implements methods for all four endpoints (`get_notes`, `create_note`, `update_note`, `delete_note`). 
2. **Error Handling**: Use `response.raise_for_status()` to catch HTTP errors (like 400 Bad Request or 401 Unauthorized) so your reasoning loop knows immediately if an operation failed.
3. **Tool Definitions (JSON Schema)**: Provide the exact JSON Schema / Tool Call definitions (using the standard OpenAI function calling format) that you will use to expose these four Python functions to your own agentic reasoning loop. Describe the arguments (like `note_id`, `title`, `content`) clearly so your LLM knows exactly when and how to call them.
