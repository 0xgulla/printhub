import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AdminStats {
    revenue: bigint;
    totalPrints: bigint;
    offlineDevices: bigint;
    onlineDevices: bigint;
}
export interface AnalysisResultView {
    nearlyBlankPages: Array<bigint>;
    lowContentPages: Array<bigint>;
    blankPages: Array<bigint>;
    fileId: FileId;
    analyzedAt: Timestamp;
    totalPages: bigint;
    colorPages: Array<bigint>;
    contentPageCount: bigint;
    issueNotes: Array<string>;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface ConnectResult {
    state: string;
    connected: boolean;
    printerId: PrinterId;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export type FileId = bigint;
export type JobId = bigint;
export type JobRef = string;
export interface PageAnalysisInput {
    nearlyBlankPages: Array<bigint>;
    lowContentPages: Array<bigint>;
    blankPages: Array<bigint>;
    totalPages: bigint;
    colorPages: Array<bigint>;
}
export interface PrintJobView {
    id: JobId;
    status: JobStatus;
    estimatedPrice: bigint;
    printedPages: bigint;
    createdAt: Timestamp;
    fileName: string;
    updatedAt: Timestamp;
    fileId: FileId;
    jobRef: JobRef;
    sizeBytes: bigint;
    printerId: PrinterId;
    options: PrintOptions;
    pageCount: bigint;
}
export interface PrintOptions {
    colorMode: ColorMode;
    excludedBlankPages: Array<bigint>;
    pageSelection: PageSelection;
    paperSize: PaperSize;
    customRange?: string;
    copies: bigint;
}
export interface PrintProgress {
    status: JobStatus;
    printedPages: bigint;
    jobId: JobId;
    updatedAt: Timestamp;
    totalPages: bigint;
}
export type PrinterId = string;
export interface PrinterStatus {
    isOnline: boolean;
    updatedAt: Timestamp;
    state: string;
    activeJobId?: JobId;
    printerId: PrinterId;
}
export interface PrinterView {
    id: PrinterId;
    paperSizes: Array<PaperSize>;
    colorModes: Array<ColorMode>;
    speedPagesPerMinute: bigint;
    name: string;
    isOnline: boolean;
    description: string;
    openingHours: string;
    rating: bigint;
    location: string;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type Timestamp = bigint;
export type UploadValidation = {
    __kind__: "ok";
    ok: AllowedExtension;
} | {
    __kind__: "unsupportedExtension";
    unsupportedExtension: string;
} | {
    __kind__: "tooLarge";
    tooLarge: {
        actualBytes: bigint;
        limitBytes: bigint;
    };
} | {
    __kind__: "empty";
    empty: null;
};
export interface UploadedFileView {
    id: FileId;
    contentType: string;
    fileName: string;
    sizeBytes: bigint;
    pageCount: bigint;
    uploadedAt: Timestamp;
}
export interface UserStats {
    totalPrints: bigint;
    totalSpent: bigint;
    savedFiles: bigint;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum AllowedExtension {
    doc = "doc",
    jpg = "jpg",
    pdf = "pdf",
    png = "png",
    docx = "docx",
    jpeg = "jpeg"
}
export enum ColorMode {
    BlackAndWhite = "BlackAndWhite",
    Color = "Color"
}
export enum JobStatus {
    Printing = "Printing",
    Failed = "Failed",
    Uploaded = "Uploaded",
    Cancelled = "Cancelled",
    Completed = "Completed"
}
export enum PageSelection {
    All = "All",
    Custom = "Custom"
}
export enum PaperSize {
    A3 = "A3",
    A4 = "A4"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / Persist the real per-page analysis for an uploaded file.
     * /
     * / The page arrays are computed from the actual PDF content by the client
     * / (pdf.js) and submitted here; the backend validates them against the
     * / document's real page count and stores the result.
     */
    analyzeFile(fileId: bigint, input: PageAnalysisInput): Promise<AnalysisResultView>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Cancel a job that has not completed.
     */
    cancelJob(jobId: JobId): Promise<PrintJobView>;
    /**
     * / Simulated connect to a printer device.
     */
    connectPrinter(printerId: string): Promise<ConnectResult>;
    /**
     * / Create a print job and start printing immediately.
     * /
     * / There is no payment step and no printer selection: the job is routed
     * / through the PrintHub portable device automatically.
     */
    createJob(fileId: bigint, options: PrintOptions): Promise<PrintJobView>;
    /**
     * / Compute the estimated price for a job from its options.
     */
    estimatePrice(pageCount: bigint, options: PrintOptions): Promise<bigint>;
    execute(qJson: string): Promise<Result>;
    /**
     * / Aggregate statistics for the admin dashboard. Admin-only.
     */
    getAdminStats(): Promise<AdminStats>;
    /**
     * / Fetch a stored analysis result for a file.
     */
    getAnalysis(fileId: bigint): Promise<AnalysisResultView | null>;
    /**
     * / Return the PrintHub backend API documentation as Markdown.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Fetch an uploaded file's metadata by id.
     */
    getFile(fileId: bigint): Promise<UploadedFileView | null>;
    /**
     * / Fetch a print job by id.
     */
    getJob(jobId: JobId): Promise<PrintJobView | null>;
    /**
     * / Read the simulated progress of a job.
     */
    getPrintProgress(jobId: JobId): Promise<PrintProgress | null>;
    /**
     * / Fetch a single printer by id.
     */
    getPrinter(printerId: string): Promise<PrinterView | null>;
    /**
     * / Simulated live status of a printer device.
     */
    getPrinterStatus(printerId: string): Promise<PrinterStatus | null>;
    /**
     * / Aggregate statistics for the caller's dashboard.
     */
    getUserStats(): Promise<UserStats>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / List the caller's uploaded files.
     */
    listFiles(): Promise<Array<UploadedFileView>>;
    /**
     * / List the caller's print jobs, newest first.
     */
    listJobs(): Promise<Array<PrintJobView>>;
    /**
     * / List every printer in the network.
     */
    listPrinters(): Promise<Array<PrinterView>>;
    /**
     * / Register an uploaded file's metadata after its bytes are stored.
     */
    registerFile(fileName: string, contentType: string, sizeBytes: bigint, pageCount: bigint): Promise<UploadedFileView>;
    schema(): Promise<string>;
    /**
     * / Search printers by name or location.
     */
    searchPrinters(searchTerm: string): Promise<Array<PrinterView>>;
    /**
     * / Advance simulated printing for all in-flight jobs.
     */
    tickPrinting(): Promise<void>;
    /**
     * / Validate an upload's file name and size before its bytes are stored.
     */
    validateUpload(fileName: string, sizeBytes: bigint): Promise<UploadValidation>;
}
