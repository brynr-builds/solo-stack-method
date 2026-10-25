
## 2024-03-14 - Fix O(N) disk I/O in content engine
**Learning:** For file-based content engines reading Markdown files, retrieving single items by directly reading the specific file using a sanitized slug is substantially faster than reading and parsing the entire directory to find a match, which avoids O(N) disk I/O and CPU bottlenecks. Extract core logic to a shared parsing function to keep data structures consistent.
**Action:** Always fetch file objects specifically by file name/slug rather than parsing everything in the folder.
