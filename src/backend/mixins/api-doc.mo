/// Static, human-readable documentation of the PrintHub public API.
///
/// The document is a compile-time literal: it reads no actor state and is
/// therefore safe to serve from a plain query. It is authored from the current
/// backend source and must be updated whenever public API behavior changes.
mixin () {
  /// Return the PrintHub backend API documentation as Markdown.
  public query func getApiDoc() : async Text {
    "# PrintHub Backend API" #
    "\n\n" #
    "PrintHub lets a user upload a document, have PrintHub AI inspect its real" #
    "\n" #
    "pages, choose print options, and send the job through the PrintHub portable" #
    "\n" #
    "device to a printer. The backend owns the printer catalogue, uploaded-file" #
    "\n" #
    "metadata, AI analysis results, and print jobs. Printer communication is" #
    "\n" #
    "simulated; no physical hardware is contacted. There is no payment step and no" #
    "\n" #
    "user-facing printer selection: every job is routed through the portable device" #
    "\n" #
    "automatically." #
    "\n\n" #
    "## Authentication and identity" #
    "\n\n" #
    "- **Anonymous callers** may read the public catalogue: `listPrinters`," #
    "\n" #
    "  `getPrinter`, `searchPrinters`, `getPrinterStatus`, `validateUpload`, and" #
    "\n" #
    "  `estimatePrice`. These are `query` methods with no caller check." #
    "\n" #
    "- **Signed-in callers** (any non-anonymous principal) are required by every" #
    "\n" #
    "  method that writes or reads personal data: `registerFile`, `listFiles`," #
    "\n" #
    "  `analyzeFile`, `createJob`, `listJobs`, `cancelJob`, `getUserStats`." #
    "\n" #
    "  Ownership is enforced per record: a caller may only read or mutate files and" #
    "\n" #
    "  jobs it owns." #
    "\n" #
    "- **Admins** are required by `getAdminStats`. A non-admin caller receives the" #
    "\n" #
    "  trap `Unauthorized: Only admins can view admin statistics`." #
    "\n" #
    "- `tickPrinting` is an unauthenticated update that advances every in-flight" #
    "\n" #
    "  job; it is a simulation driver, not a user action." #
    "\n\n" #
    "The app's frontend pins an Internet Identity derivation origin, published at" #
    "\n" #
    "`/.well-known/ii-derivation-origin` when available. An agent already holding" #
    "\n" #
    "the user's Internet Identity authorization derives the correct per-app" #
    "\n" #
    "principal against that origin (for example" #
    "\n" #
    "`icp identity link web <name> --app <host>`). Such a delegation acts with the" #
    "\n" #
    "user's full authority in this app until it expires." #
    "\n\n" #
    "Registration is a prerequisite for role-guarded calls. A direct API caller" #
    "\n" #
    "registers by calling `_initialize_access_control` once as a signed-in caller" #
    "\n" #
    "before any role-guarded call, guarded queries included. The first caller to" #
    "\n" #
    "initialize receives the `#admin` role; every later caller receives `#user`." #
    "\n" #
    "`getCallerUserRole` traps with `User is not registered` for an unregistered" #
    "\n" #
    "caller, and `assignCallerUserRole` traps with `Unauthorized: Only admins can" #
    "\n" #
    "assign roles` for a non-admin. A principal that never signed in through the" #
    "\n" #
    "app's own frontend is unregistered even when it belongs to the app's owner," #
    "\n" #
    "and a signed-in caller derived against a different origin is a different" #
    "\n" #
    "principal than the one the frontend registered. Unregistered callers can" #
    "\n" #
    "still read the public catalogue, but personal-data methods return empty" #
    "\n" #
    "results or trap on ownership checks." #
    "\n\n" #
    "## Units and encodings" #
    "\n\n" #
    "- **Price** is in whole rupees (`Nat`), computed as" #
    "\n" #
    "  `billedPages x perPage x paperMultiplier x copies`, where `perPage` is 1 for" #
    "\n" #
    "  black & white and 5 for colour, and `paperMultiplier` is 1 for A4 and 2 for" #
    "\n" #
    "  A3. `billedPages` is the file's page count minus the number of excluded blank" #
    "\n" #
    "  pages, multiplied by copies." #
    "\n" #
    "- **Sizes** are in bytes (`Nat`). The upload limit is 20 MB" #
    "\n" #
    "  (20 x 1024 x 1024 bytes)." #
    "\n" #
    "- **Timestamps** are nanoseconds since the Unix epoch (`Int`), from" #
    "\n" #
    "  `Time.now()`." #
    "\n" #
    "- **Identifiers**: `fileId` and `jobId` are `Nat`; `printerId` is `Text` such as" #
    "\n" #
    "  `\"PH-001\"`; `jobRef` is a human-facing `Text` such as `\"PH10245\"`." #
    "\n" #
    "- **Variants** cross the boundary as Candid variants: `PaperSize` is `#A4` or" #
    "\n" #
    "  `#A3`; `ColorMode` is `#BlackAndWhite` or `#Color`; `PageSelection` is `#All`" #
    "\n" #
    "  or `#Custom`; `JobStatus` is `#Uploaded`, `#Printing`, `#Completed`," #
    "\n" #
    "  `#Cancelled`, or `#Failed`." #
    "\n" #
    "- **Optional values** are Candid `opt`; `null` means \"not present\", e.g." #
    "\n" #
    "  `getFile` returns `null` for an unknown id." #
    "\n" #
    "- **Page numbers** in analysis results are 1-based and within `1..totalPages`." #
    "\n" #
    "- **`getApiDoc`** returns this document as a Markdown `Text`; it is a static" #
    "\n" #
    "  literal and reads no actor state." #
    "\n\n" #
    "## Endpoints" #
    "\n\n" #
    "### Printers" #
    "\n\n" #
    "- `listPrinters() : [PrinterView]` — every printer in the network." #
    "\n" #
    "- `getPrinter(printerId) : ?PrinterView` — one printer, or `null`." #
    "\n" #
    "- `searchPrinters(searchTerm) : [PrinterView]` — case-insensitive match on name" #
    "\n" #
    "  or location; an empty term returns the full list." #
    "\n" #
    "- `connectPrinter(printerId) : ConnectResult` — simulated connect. Returns" #
    "\n" #
    "  `connected = true` and `state = \"ONLINE\"` for an online printer," #
    "\n" #
    "  `connected = false` / `\"OFFLINE\"` for an offline one, and" #
    "\n" #
    "  `connected = false` / `\"UNKNOWN\"` for an unknown id (it does not trap)." #
    "\n" #
    "- `getPrinterStatus(printerId) : ?PrinterStatus` — simulated live status," #
    "\n" #
    "  including `activeJobId` when a job for that printer is `#Printing`." #
    "\n\n" #
    "### Files" #
    "\n\n" #
    "- `validateUpload(fileName, sizeBytes) : UploadValidation` — checks extension" #
    "\n" #
    "  and size before bytes are stored. Returns `#ok(ext)`, `#empty` for zero" #
    "\n" #
    "  bytes, `#tooLarge({ limitBytes; actualBytes })`, or" #
    "\n" #
    "  `#unsupportedExtension(ext)`. Allowed extensions: pdf, jpg, jpeg, png, doc," #
    "\n" #
    "  docx." #
    "\n" #
    "- `registerFile(fileName, contentType, sizeBytes, pageCount) : UploadedFileView`" #
    "\n" #
    "  — records metadata after the bytes are stored and returns the new file id." #
    "\n" #
    "  The stored name is derived as `<fileId>-<fileName>` so two uploads of the" #
    "\n" #
    "  same name never collide. The stored name is never returned by the API." #
    "\n" #
    "- `getFile(fileId) : ?UploadedFileView` — metadata for any file id." #
    "\n" #
    "- `listFiles() : [UploadedFileView]` — the caller's files, newest first." #
    "\n\n" #
    "### AI analysis" #
    "\n\n" #
    "- `analyzeFile(fileId, input) : AnalysisResultView` — persists the real" #
    "\n" #
    "  per-page analysis for a file the caller owns. `input` is a" #
    "\n" #
    "  `PageAnalysisInput` computed from the actual PDF content by the client:" #
    "\n" #
    "  `totalPages`, `blankPages`, `nearlyBlankPages`, `lowContentPages`, and" #
    "\n" #
    "  `colorPages`, each an array of 1-based page numbers. The backend validates" #
    "\n" #
    "  every page number against `totalPages`, de-duplicates and sorts them, and" #
    "\n" #
    "  derives `contentPageCount` (total pages minus blank pages) and `issueNotes`." #
    "\n" #
    "  Traps with `Unknown file id`, `File does not belong to the caller`, or" #
    "\n" #
    "  `Analysis page count does not match the uploaded file`." #
    "\n" #
    "- `getAnalysis(fileId) : ?AnalysisResultView` — the stored result, or `null` if" #
    "\n" #
    "  the file has not been analyzed." #
    "\n\n" #
    "### Jobs" #
    "\n\n" #
    "- `estimatePrice(pageCount, options) : Nat` — price in rupees without creating" #
    "\n" #
    "  a job." #
    "\n" #
    "- `createJob(fileId, options) : PrintJobView` — creates a job and starts" #
    "\n" #
    "  printing immediately: the status is `#Printing` and `printerId` is the" #
    "\n" #
    "  PrintHub portable device. There is no payment step and no printer argument." #
    "\n" #
    "  `pageCount` on the returned job is the printable page count (the file's real" #
    "\n" #
    "  page count minus `excludedBlankPages`). Traps on `Copies must be at least 1`," #
    "\n" #
    "  `Unknown file id`, or `File does not belong to the caller`." #
    "\n" #
    "- `getJob(jobId) : ?PrintJobView` — any job by id." #
    "\n" #
    "- `listJobs() : [PrintJobView]` — the caller's jobs, newest first." #
    "\n" #
    "- `getPrintProgress(jobId) : ?PrintProgress` — `printedPages`, `totalPages`" #
    "\n" #
    "  (billed pages), `status`, and `updatedAt`." #
    "\n" #
    "- `cancelJob(jobId) : PrintJobView` — cancels a job that is not completed." #
    "\n" #
    "  Traps with `Completed jobs cannot be cancelled` or `Job is already" #
    "\n" #
    "  cancelled`." #
    "\n" #
    "- `tickPrinting()` — advances every `#Printing` job by one page (two when the" #
    "\n" #
    "  billed total exceeds 20), completing it when the total is reached." #
    "\n" #
    "- `getUserStats() : UserStats` — `totalPrints` and `totalSpent` count only" #
    "\n" #
    "  `#Completed` jobs; `savedFiles` counts the caller's uploaded files." #
    "\n" #
    "- `getAdminStats() : AdminStats` — admin only. `totalPrints` and `revenue`" #
    "\n" #
    "  count `#Completed` jobs; `onlineDevices` / `offlineDevices` count printers." #
    "\n\n" #
    "### Data intelligence (OQL)" #
    "\n\n" #
    "The canister exposes its persisted tables to the Caffeine Data Intelligence" #
    "agent through the OQL `Expose` mixin, which adds two public methods:" #
    "\n\n" #
    "- `schema() : Text` — the JSON schema of every exposed table." #
    "\n" #
    "- `execute(queryJson) : Text` — runs a JSON query and returns JSON rows." #
    "\n\n" #
    "Authorization is per table and is checked against the live caller on both" #
    "methods:" #
    "\n\n" #
    "- `printer` — public: anyone, including anonymous callers, may read the" #
    "\n" #
    "  catalogue." #
    "\n" #
    "- `file` — controller-or-scoped: the platform controller reads all rows; a" #
    "\n" #
    "  signed-in caller reads only files it owns. The internal `storedName` column" #
    "\n" #
    "  is hidden from the schema and the default projection." #
    "\n" #
    "- `job` — controller-or-scoped: the controller reads all rows; a signed-in" #
    "\n" #
    "  caller reads only its own jobs." #
    "\n" #
    "- `analysis` — controller-only: only the platform controller reads analysis" #
    "\n" #
    "  rows; end users read their own analysis through `getAnalysis` instead." #
    "\n\n" #
    "## Print job lifecycle" #
    "\n\n" #
    "`createJob` puts a job straight into `#Printing`; there is no payment state." #
    "\n" #
    "`tickPrinting` advances it to `#Completed` once the billed page total is" #
    "\n" #
    "reached. `#Cancelled` is reachable from any non-completed state via `cancelJob`;" #
    "\n" #
    "`#Uploaded` and `#Failed` are reserved for future use." #
    "\n\n" #
    "## Polling print progress" #
    "\n\n" #
    "`getPrintProgress` is a `query` and is safe to poll. Poll it after `createJob`;" #
    "\n" #
    "the job advances only when `tickPrinting` is called, so a client that wants" #
    "\n" #
    "live movement should call `tickPrinting` on an interval and then re-read" #
    "\n" #
    "progress. Stop polling once `status` is `#Completed`, `#Cancelled`, or" #
    "\n" #
    "`#Failed`." #
    "\n\n" #
    "## Mutation retry safety" #
    "\n\n" #
    "- `registerFile`, `createJob`, and `analyzeFile` are **not idempotent**: each" #
    "\n" #
    "  call allocates a new id or overwrites the stored analysis. Retrying after a" #
    "\n" #
    "  timeout can create a duplicate file or job." #
    "\n" #
    "- `cancelJob` is effectively idempotent in its terminal direction but traps on" #
    "\n" #
    "  invalid transitions (`cancelJob` on a completed or already-cancelled job)." #
    "\n" #
    "  Treat a trap as \"already in that state\" and re-read the job rather than" #
    "\n" #
    "  retrying blindly." #
    "\n" #
    "- `tickPrinting` is safe to call repeatedly; it clamps at the billed total." #
    "\n\n" #
    "## Errors, traps, and gotchas" #
    "\n\n" #
    "- Ownership traps: `File does not belong to the caller`, `Job does not belong" #
    "\n" #
    "  to the caller`." #
    "\n" #
    "- Lookup traps: `Unknown file id`, `Unknown job id`." #
    "\n" #
    "- State traps: `Copies must be at least 1`, `Analysis page count does not match" #
    "\n" #
    "  the uploaded file`, `Completed jobs cannot be cancelled`, `Job is already" #
    "\n" #
    "  cancelled`." #
    "\n" #
    "- Authorization trap: `Unauthorized: Only admins can view admin statistics`." #
    "\n" #
    "- `getFile` and `getJob` are **not** ownership-scoped and return metadata for" #
    "\n" #
    "  any id; do not treat them as private." #
    "\n" #
    "- `estimatePrice` and `createJob` must use the same options, or the quoted" #
    "\n" #
    "  price will differ from the created job's `estimatedPrice`." #
    "\n" #
    "- Excluding blank pages reduces `billedPages`, which changes both the price and" #
    "\n" #
    "  the `totalPages` reported by `getPrintProgress`." #
    "\n" #
    "- Printer communication is simulated; `connectPrinter` and `getPrinterStatus`" #
    "\n" #
    "  reflect catalogue state, not hardware." #
    "\n";
  };
};
