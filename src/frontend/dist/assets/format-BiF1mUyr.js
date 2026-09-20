import { j as jsxRuntimeExports, B as Button, a as cn, V as Variant, M as Text, N as Null, Q as Record, U as Vec, W as Nat, Y as Int, Z as Opt, _ as Bool, $ as Float64, a0 as Service, a1 as Func, a2 as Principal, a3 as Nat8, a4 as HttpAgent, a5 as Actor } from "./index-CtAioZuW.js";
function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  className,
  ocid = "empty_state"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": ocid,
      className: cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-sm text-sm text-muted-foreground", children: message }),
        actionLabel && onAction ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: onAction,
            "data-ocid": `${ocid}.action_button`,
            className: "mt-6 rounded-full transition-smooth",
            children: actionLabel
          }
        ) : null
      ]
    }
  );
}
const Error$1 = Variant({
  "FrontendOriginsNotConfigured": Null,
  "MixedSsoSources": Record({
    "otherKeys": Vec(Text),
    "ssoKeys": Vec(Text)
  }),
  "Stale": Record({ "ageNs": Nat }),
  "MalformedCandid": Null,
  "AmbiguousAttribute": Record({
    "field": Text,
    "sources": Vec(Text)
  }),
  "NoAttributes": Null,
  "UnknownNonce": Null,
  "UntrustedSsoSource": Record({ "domain": Text }),
  "MissingField": Text,
  "FrontendOriginMismatch": Record({
    "got": Text,
    "expected": Vec(Text)
  })
});
const Result__1 = Variant({ "ok": Null, "err": Error$1 });
const PageAnalysisInput = Record({
  "nearlyBlankPages": Vec(Nat),
  "lowContentPages": Vec(Nat),
  "blankPages": Vec(Nat),
  "totalPages": Nat,
  "colorPages": Vec(Nat)
});
const FileId = Nat;
const Timestamp = Int;
const AnalysisResultView = Record({
  "nearlyBlankPages": Vec(Nat),
  "lowContentPages": Vec(Nat),
  "blankPages": Vec(Nat),
  "fileId": FileId,
  "analyzedAt": Timestamp,
  "totalPages": Nat,
  "colorPages": Vec(Nat),
  "contentPageCount": Nat,
  "issueNotes": Vec(Text)
});
const UserRole = Variant({
  "admin": Null,
  "user": Null,
  "guest": Null
});
const JobId = Nat;
const JobStatus$1 = Variant({
  "Printing": Null,
  "Failed": Null,
  "Uploaded": Null,
  "Cancelled": Null,
  "Completed": Null
});
const JobRef = Text;
const PrinterId = Text;
const ColorMode$1 = Variant({
  "BlackAndWhite": Null,
  "Color": Null
});
const PageSelection$1 = Variant({
  "All": Null,
  "Custom": Null
});
const PaperSize$1 = Variant({ "A3": Null, "A4": Null });
const PrintOptions = Record({
  "colorMode": ColorMode$1,
  "excludedBlankPages": Vec(Nat),
  "pageSelection": PageSelection$1,
  "paperSize": PaperSize$1,
  "customRange": Opt(Text),
  "copies": Nat
});
const PrintJobView = Record({
  "id": JobId,
  "status": JobStatus$1,
  "estimatedPrice": Nat,
  "printedPages": Nat,
  "createdAt": Timestamp,
  "fileName": Text,
  "updatedAt": Timestamp,
  "fileId": FileId,
  "jobRef": JobRef,
  "sizeBytes": Nat,
  "printerId": PrinterId,
  "options": PrintOptions,
  "pageCount": Nat
});
const ConnectResult = Record({
  "state": Text,
  "connected": Bool,
  "printerId": PrinterId
});
const Value = Variant({
  "int": Int,
  "nat": Nat,
  "float": Float64,
  "bool": Bool,
  "null": Null,
  "text": Text
});
const Cell = Record({ "value": Value, "name": Text });
const Result = Record({
  "hasMore": Bool,
  "rows": Vec(Vec(Cell))
});
const AdminStats = Record({
  "revenue": Nat,
  "totalPrints": Nat,
  "offlineDevices": Nat,
  "onlineDevices": Nat
});
const UploadedFileView = Record({
  "id": FileId,
  "contentType": Text,
  "fileName": Text,
  "sizeBytes": Nat,
  "pageCount": Nat,
  "uploadedAt": Timestamp
});
const PrintProgress = Record({
  "status": JobStatus$1,
  "printedPages": Nat,
  "jobId": JobId,
  "updatedAt": Timestamp,
  "totalPages": Nat
});
const PrinterView = Record({
  "id": PrinterId,
  "paperSizes": Vec(PaperSize$1),
  "colorModes": Vec(ColorMode$1),
  "speedPagesPerMinute": Nat,
  "name": Text,
  "isOnline": Bool,
  "description": Text,
  "openingHours": Text,
  "rating": Nat,
  "location": Text
});
const PrinterStatus = Record({
  "isOnline": Bool,
  "updatedAt": Timestamp,
  "state": Text,
  "activeJobId": Opt(JobId),
  "printerId": PrinterId
});
const UserStats = Record({
  "totalPrints": Nat,
  "totalSpent": Nat,
  "savedFiles": Nat
});
const AllowedExtension = Variant({
  "doc": Null,
  "jpg": Null,
  "pdf": Null,
  "png": Null,
  "docx": Null,
  "jpeg": Null
});
const UploadValidation = Variant({
  "ok": AllowedExtension,
  "unsupportedExtension": Text,
  "tooLarge": Record({ "actualBytes": Nat, "limitBytes": Nat }),
  "empty": Null
});
Service({
  "_initialize_access_control": Func([], [], []),
  "_internet_identity_sign_in_finish": Func([], [Result__1], []),
  "_internet_identity_sign_in_start": Func([], [Vec(Nat8)], []),
  "analyzeFile": Func(
    [Nat, PageAnalysisInput],
    [AnalysisResultView],
    []
  ),
  "assignCallerUserRole": Func([Principal, UserRole], [], []),
  "cancelJob": Func([JobId], [PrintJobView], []),
  "connectPrinter": Func([Text], [ConnectResult], []),
  "createJob": Func([Nat, PrintOptions], [PrintJobView], []),
  "estimatePrice": Func([Nat, PrintOptions], [Nat], ["query"]),
  "execute": Func([Text], [Result], ["query"]),
  "getAdminStats": Func([], [AdminStats], ["query"]),
  "getAnalysis": Func([Nat], [Opt(AnalysisResultView)], ["query"]),
  "getApiDoc": Func([], [Text], ["query"]),
  "getCallerUserRole": Func([], [UserRole], ["query"]),
  "getFile": Func([Nat], [Opt(UploadedFileView)], ["query"]),
  "getJob": Func([JobId], [Opt(PrintJobView)], ["query"]),
  "getPrintProgress": Func([JobId], [Opt(PrintProgress)], ["query"]),
  "getPrinter": Func([Text], [Opt(PrinterView)], ["query"]),
  "getPrinterStatus": Func(
    [Text],
    [Opt(PrinterStatus)],
    ["query"]
  ),
  "getUserStats": Func([], [UserStats], ["query"]),
  "isCallerAdmin": Func([], [Bool], ["query"]),
  "listFiles": Func([], [Vec(UploadedFileView)], ["query"]),
  "listJobs": Func([], [Vec(PrintJobView)], ["query"]),
  "listPrinters": Func([], [Vec(PrinterView)], ["query"]),
  "registerFile": Func(
    [Text, Text, Nat, Nat],
    [UploadedFileView],
    []
  ),
  "schema": Func([], [Text], ["query"]),
  "searchPrinters": Func([Text], [Vec(PrinterView)], ["query"]),
  "tickPrinting": Func([], [], []),
  "validateUpload": Func(
    [Text, Nat],
    [UploadValidation],
    ["query"]
  )
});
const idlFactory = ({ IDL }) => {
  const Error2 = IDL.Variant({
    "FrontendOriginsNotConfigured": IDL.Null,
    "MixedSsoSources": IDL.Record({
      "otherKeys": IDL.Vec(IDL.Text),
      "ssoKeys": IDL.Vec(IDL.Text)
    }),
    "Stale": IDL.Record({ "ageNs": IDL.Nat }),
    "MalformedCandid": IDL.Null,
    "AmbiguousAttribute": IDL.Record({
      "field": IDL.Text,
      "sources": IDL.Vec(IDL.Text)
    }),
    "NoAttributes": IDL.Null,
    "UnknownNonce": IDL.Null,
    "UntrustedSsoSource": IDL.Record({ "domain": IDL.Text }),
    "MissingField": IDL.Text,
    "FrontendOriginMismatch": IDL.Record({
      "got": IDL.Text,
      "expected": IDL.Vec(IDL.Text)
    })
  });
  const Result__12 = IDL.Variant({ "ok": IDL.Null, "err": Error2 });
  const PageAnalysisInput2 = IDL.Record({
    "nearlyBlankPages": IDL.Vec(IDL.Nat),
    "lowContentPages": IDL.Vec(IDL.Nat),
    "blankPages": IDL.Vec(IDL.Nat),
    "totalPages": IDL.Nat,
    "colorPages": IDL.Vec(IDL.Nat)
  });
  const FileId2 = IDL.Nat;
  const Timestamp2 = IDL.Int;
  const AnalysisResultView2 = IDL.Record({
    "nearlyBlankPages": IDL.Vec(IDL.Nat),
    "lowContentPages": IDL.Vec(IDL.Nat),
    "blankPages": IDL.Vec(IDL.Nat),
    "fileId": FileId2,
    "analyzedAt": Timestamp2,
    "totalPages": IDL.Nat,
    "colorPages": IDL.Vec(IDL.Nat),
    "contentPageCount": IDL.Nat,
    "issueNotes": IDL.Vec(IDL.Text)
  });
  const UserRole2 = IDL.Variant({
    "admin": IDL.Null,
    "user": IDL.Null,
    "guest": IDL.Null
  });
  const JobId2 = IDL.Nat;
  const JobStatus2 = IDL.Variant({
    "Printing": IDL.Null,
    "Failed": IDL.Null,
    "Uploaded": IDL.Null,
    "Cancelled": IDL.Null,
    "Completed": IDL.Null
  });
  const JobRef2 = IDL.Text;
  const PrinterId2 = IDL.Text;
  const ColorMode2 = IDL.Variant({
    "BlackAndWhite": IDL.Null,
    "Color": IDL.Null
  });
  const PageSelection2 = IDL.Variant({ "All": IDL.Null, "Custom": IDL.Null });
  const PaperSize2 = IDL.Variant({ "A3": IDL.Null, "A4": IDL.Null });
  const PrintOptions2 = IDL.Record({
    "colorMode": ColorMode2,
    "excludedBlankPages": IDL.Vec(IDL.Nat),
    "pageSelection": PageSelection2,
    "paperSize": PaperSize2,
    "customRange": IDL.Opt(IDL.Text),
    "copies": IDL.Nat
  });
  const PrintJobView2 = IDL.Record({
    "id": JobId2,
    "status": JobStatus2,
    "estimatedPrice": IDL.Nat,
    "printedPages": IDL.Nat,
    "createdAt": Timestamp2,
    "fileName": IDL.Text,
    "updatedAt": Timestamp2,
    "fileId": FileId2,
    "jobRef": JobRef2,
    "sizeBytes": IDL.Nat,
    "printerId": PrinterId2,
    "options": PrintOptions2,
    "pageCount": IDL.Nat
  });
  const ConnectResult2 = IDL.Record({
    "state": IDL.Text,
    "connected": IDL.Bool,
    "printerId": PrinterId2
  });
  const Value2 = IDL.Variant({
    "int": IDL.Int,
    "nat": IDL.Nat,
    "float": IDL.Float64,
    "bool": IDL.Bool,
    "null": IDL.Null,
    "text": IDL.Text
  });
  const Cell2 = IDL.Record({ "value": Value2, "name": IDL.Text });
  const Result2 = IDL.Record({
    "hasMore": IDL.Bool,
    "rows": IDL.Vec(IDL.Vec(Cell2))
  });
  const AdminStats2 = IDL.Record({
    "revenue": IDL.Nat,
    "totalPrints": IDL.Nat,
    "offlineDevices": IDL.Nat,
    "onlineDevices": IDL.Nat
  });
  const UploadedFileView2 = IDL.Record({
    "id": FileId2,
    "contentType": IDL.Text,
    "fileName": IDL.Text,
    "sizeBytes": IDL.Nat,
    "pageCount": IDL.Nat,
    "uploadedAt": Timestamp2
  });
  const PrintProgress2 = IDL.Record({
    "status": JobStatus2,
    "printedPages": IDL.Nat,
    "jobId": JobId2,
    "updatedAt": Timestamp2,
    "totalPages": IDL.Nat
  });
  const PrinterView2 = IDL.Record({
    "id": PrinterId2,
    "paperSizes": IDL.Vec(PaperSize2),
    "colorModes": IDL.Vec(ColorMode2),
    "speedPagesPerMinute": IDL.Nat,
    "name": IDL.Text,
    "isOnline": IDL.Bool,
    "description": IDL.Text,
    "openingHours": IDL.Text,
    "rating": IDL.Nat,
    "location": IDL.Text
  });
  const PrinterStatus2 = IDL.Record({
    "isOnline": IDL.Bool,
    "updatedAt": Timestamp2,
    "state": IDL.Text,
    "activeJobId": IDL.Opt(JobId2),
    "printerId": PrinterId2
  });
  const UserStats2 = IDL.Record({
    "totalPrints": IDL.Nat,
    "totalSpent": IDL.Nat,
    "savedFiles": IDL.Nat
  });
  const AllowedExtension2 = IDL.Variant({
    "doc": IDL.Null,
    "jpg": IDL.Null,
    "pdf": IDL.Null,
    "png": IDL.Null,
    "docx": IDL.Null,
    "jpeg": IDL.Null
  });
  const UploadValidation2 = IDL.Variant({
    "ok": AllowedExtension2,
    "unsupportedExtension": IDL.Text,
    "tooLarge": IDL.Record({
      "actualBytes": IDL.Nat,
      "limitBytes": IDL.Nat
    }),
    "empty": IDL.Null
  });
  return IDL.Service({
    "_initialize_access_control": IDL.Func([], [], []),
    "_internet_identity_sign_in_finish": IDL.Func([], [Result__12], []),
    "_internet_identity_sign_in_start": IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
    "analyzeFile": IDL.Func(
      [IDL.Nat, PageAnalysisInput2],
      [AnalysisResultView2],
      []
    ),
    "assignCallerUserRole": IDL.Func([IDL.Principal, UserRole2], [], []),
    "cancelJob": IDL.Func([JobId2], [PrintJobView2], []),
    "connectPrinter": IDL.Func([IDL.Text], [ConnectResult2], []),
    "createJob": IDL.Func([IDL.Nat, PrintOptions2], [PrintJobView2], []),
    "estimatePrice": IDL.Func([IDL.Nat, PrintOptions2], [IDL.Nat], ["query"]),
    "execute": IDL.Func([IDL.Text], [Result2], ["query"]),
    "getAdminStats": IDL.Func([], [AdminStats2], ["query"]),
    "getAnalysis": IDL.Func(
      [IDL.Nat],
      [IDL.Opt(AnalysisResultView2)],
      ["query"]
    ),
    "getApiDoc": IDL.Func([], [IDL.Text], ["query"]),
    "getCallerUserRole": IDL.Func([], [UserRole2], ["query"]),
    "getFile": IDL.Func([IDL.Nat], [IDL.Opt(UploadedFileView2)], ["query"]),
    "getJob": IDL.Func([JobId2], [IDL.Opt(PrintJobView2)], ["query"]),
    "getPrintProgress": IDL.Func([JobId2], [IDL.Opt(PrintProgress2)], ["query"]),
    "getPrinter": IDL.Func([IDL.Text], [IDL.Opt(PrinterView2)], ["query"]),
    "getPrinterStatus": IDL.Func(
      [IDL.Text],
      [IDL.Opt(PrinterStatus2)],
      ["query"]
    ),
    "getUserStats": IDL.Func([], [UserStats2], ["query"]),
    "isCallerAdmin": IDL.Func([], [IDL.Bool], ["query"]),
    "listFiles": IDL.Func([], [IDL.Vec(UploadedFileView2)], ["query"]),
    "listJobs": IDL.Func([], [IDL.Vec(PrintJobView2)], ["query"]),
    "listPrinters": IDL.Func([], [IDL.Vec(PrinterView2)], ["query"]),
    "registerFile": IDL.Func(
      [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
      [UploadedFileView2],
      []
    ),
    "schema": IDL.Func([], [IDL.Text], ["query"]),
    "searchPrinters": IDL.Func([IDL.Text], [IDL.Vec(PrinterView2)], ["query"]),
    "tickPrinting": IDL.Func([], [], []),
    "validateUpload": IDL.Func(
      [IDL.Text, IDL.Nat],
      [UploadValidation2],
      ["query"]
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var ColorMode = /* @__PURE__ */ ((ColorMode2) => {
  ColorMode2["BlackAndWhite"] = "BlackAndWhite";
  ColorMode2["Color"] = "Color";
  return ColorMode2;
})(ColorMode || {});
var JobStatus = /* @__PURE__ */ ((JobStatus2) => {
  JobStatus2["Printing"] = "Printing";
  JobStatus2["Failed"] = "Failed";
  JobStatus2["Uploaded"] = "Uploaded";
  JobStatus2["Cancelled"] = "Cancelled";
  JobStatus2["Completed"] = "Completed";
  return JobStatus2;
})(JobStatus || {});
var PageSelection = /* @__PURE__ */ ((PageSelection2) => {
  PageSelection2["All"] = "All";
  PageSelection2["Custom"] = "Custom";
  return PageSelection2;
})(PageSelection || {});
var PaperSize = /* @__PURE__ */ ((PaperSize2) => {
  PaperSize2["A3"] = "A3";
  PaperSize2["A4"] = "A4";
  return PaperSize2;
})(PaperSize || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async _initialize_access_control() {
    if (this.processError) {
      try {
        const result = await this.actor._initialize_access_control();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._initialize_access_control();
      return result;
    }
  }
  async _internet_identity_sign_in_finish() {
    if (this.processError) {
      try {
        const result = await this.actor._internet_identity_sign_in_finish();
        return from_candid_Result__1_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._internet_identity_sign_in_finish();
      return from_candid_Result__1_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async _internet_identity_sign_in_start() {
    if (this.processError) {
      try {
        const result = await this.actor._internet_identity_sign_in_start();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._internet_identity_sign_in_start();
      return result;
    }
  }
  async analyzeFile(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.analyzeFile(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.analyzeFile(arg0, arg1);
      return result;
    }
  }
  async assignCallerUserRole(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n5(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n5(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async cancelJob(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.cancelJob(arg0);
        return from_candid_PrintJobView_n6(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.cancelJob(arg0);
      return from_candid_PrintJobView_n6(this._uploadFile, this._downloadFile, result);
    }
  }
  async connectPrinter(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.connectPrinter(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.connectPrinter(arg0);
      return result;
    }
  }
  async createJob(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.createJob(arg0, to_candid_PrintOptions_n15(this._uploadFile, this._downloadFile, arg1));
        return from_candid_PrintJobView_n6(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createJob(arg0, to_candid_PrintOptions_n15(this._uploadFile, this._downloadFile, arg1));
      return from_candid_PrintJobView_n6(this._uploadFile, this._downloadFile, result);
    }
  }
  async estimatePrice(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.estimatePrice(arg0, to_candid_PrintOptions_n15(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.estimatePrice(arg0, to_candid_PrintOptions_n15(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async execute(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.execute(arg0);
        return from_candid_Result_n20(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.execute(arg0);
      return from_candid_Result_n20(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAdminStats() {
    if (this.processError) {
      try {
        const result = await this.actor.getAdminStats();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAdminStats();
      return result;
    }
  }
  async getAnalysis(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAnalysis(arg0);
        return from_candid_opt_n28(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAnalysis(arg0);
      return from_candid_opt_n28(this._uploadFile, this._downloadFile, result);
    }
  }
  async getApiDoc() {
    if (this.processError) {
      try {
        const result = await this.actor.getApiDoc();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getApiDoc();
      return result;
    }
  }
  async getCallerUserRole() {
    if (this.processError) {
      try {
        const result = await this.actor.getCallerUserRole();
        return from_candid_UserRole_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallerUserRole();
      return from_candid_UserRole_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async getFile(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getFile(arg0);
        return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getFile(arg0);
      return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async getJob(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getJob(arg0);
        return from_candid_opt_n31(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getJob(arg0);
      return from_candid_opt_n31(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPrintProgress(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getPrintProgress(arg0);
        return from_candid_opt_n32(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPrintProgress(arg0);
      return from_candid_opt_n32(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPrinter(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getPrinter(arg0);
        return from_candid_opt_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPrinter(arg0);
      return from_candid_opt_n35(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPrinterStatus(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getPrinterStatus(arg0);
        return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPrinterStatus(arg0);
      return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUserStats() {
    if (this.processError) {
      try {
        const result = await this.actor.getUserStats();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserStats();
      return result;
    }
  }
  async isCallerAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.isCallerAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isCallerAdmin();
      return result;
    }
  }
  async listFiles() {
    if (this.processError) {
      try {
        const result = await this.actor.listFiles();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listFiles();
      return result;
    }
  }
  async listJobs() {
    if (this.processError) {
      try {
        const result = await this.actor.listJobs();
        return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listJobs();
      return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
    }
  }
  async listPrinters() {
    if (this.processError) {
      try {
        const result = await this.actor.listPrinters();
        return from_candid_vec_n45(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listPrinters();
      return from_candid_vec_n45(this._uploadFile, this._downloadFile, result);
    }
  }
  async registerFile(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.registerFile(arg0, arg1, arg2, arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.registerFile(arg0, arg1, arg2, arg3);
      return result;
    }
  }
  async schema() {
    if (this.processError) {
      try {
        const result = await this.actor.schema();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.schema();
      return result;
    }
  }
  async searchPrinters(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchPrinters(arg0);
        return from_candid_vec_n45(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchPrinters(arg0);
      return from_candid_vec_n45(this._uploadFile, this._downloadFile, result);
    }
  }
  async tickPrinting() {
    if (this.processError) {
      try {
        const result = await this.actor.tickPrinting();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.tickPrinting();
      return result;
    }
  }
  async validateUpload(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.validateUpload(arg0, arg1);
        return from_candid_UploadValidation_n46(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.validateUpload(arg0, arg1);
      return from_candid_UploadValidation_n46(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_AllowedExtension_n48(_uploadFile, _downloadFile, value) {
  return "doc" in value ? "doc" : "jpg" in value ? "jpg" : "pdf" in value ? "pdf" : "png" in value ? "png" : "docx" in value ? "docx" : "jpeg" in value ? "jpeg" : value;
}
function from_candid_Cell_n24(_uploadFile, _downloadFile, value) {
  return from_candid_record_n25(_uploadFile, _downloadFile, value);
}
function from_candid_ColorMode_n11(_uploadFile, _downloadFile, value) {
  return "BlackAndWhite" in value ? "BlackAndWhite" : "Color" in value ? "Color" : value;
}
function from_candid_Error_n3(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function from_candid_JobStatus_n8(_uploadFile, _downloadFile, value) {
  return "Printing" in value ? "Printing" : "Failed" in value ? "Failed" : "Uploaded" in value ? "Uploaded" : "Cancelled" in value ? "Cancelled" : "Completed" in value ? "Completed" : value;
}
function from_candid_PageSelection_n12(_uploadFile, _downloadFile, value) {
  return "All" in value ? "All" : "Custom" in value ? "Custom" : value;
}
function from_candid_PaperSize_n13(_uploadFile, _downloadFile, value) {
  return "A3" in value ? "A3" : "A4" in value ? "A4" : value;
}
function from_candid_PrintJobView_n6(_uploadFile, _downloadFile, value) {
  return from_candid_record_n7(_uploadFile, _downloadFile, value);
}
function from_candid_PrintOptions_n9(_uploadFile, _downloadFile, value) {
  return from_candid_record_n10(_uploadFile, _downloadFile, value);
}
function from_candid_PrintProgress_n33(_uploadFile, _downloadFile, value) {
  return from_candid_record_n34(_uploadFile, _downloadFile, value);
}
function from_candid_PrinterStatus_n41(_uploadFile, _downloadFile, value) {
  return from_candid_record_n42(_uploadFile, _downloadFile, value);
}
function from_candid_PrinterView_n36(_uploadFile, _downloadFile, value) {
  return from_candid_record_n37(_uploadFile, _downloadFile, value);
}
function from_candid_Result__1_n1(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n2(_uploadFile, _downloadFile, value);
}
function from_candid_Result_n20(_uploadFile, _downloadFile, value) {
  return from_candid_record_n21(_uploadFile, _downloadFile, value);
}
function from_candid_UploadValidation_n46(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n47(_uploadFile, _downloadFile, value);
}
function from_candid_UserRole_n29(_uploadFile, _downloadFile, value) {
  return "admin" in value ? "admin" : "user" in value ? "user" : "guest" in value ? "guest" : value;
}
function from_candid_Value_n26(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n27(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n14(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n28(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n30(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n31(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PrintJobView_n6(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n32(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PrintProgress_n33(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n35(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PrinterView_n36(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n40(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PrinterStatus_n41(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n43(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n10(_uploadFile, _downloadFile, value) {
  return {
    colorMode: from_candid_ColorMode_n11(_uploadFile, _downloadFile, value.colorMode),
    excludedBlankPages: value.excludedBlankPages,
    pageSelection: from_candid_PageSelection_n12(_uploadFile, _downloadFile, value.pageSelection),
    paperSize: from_candid_PaperSize_n13(_uploadFile, _downloadFile, value.paperSize),
    customRange: record_opt_to_undefined(from_candid_opt_n14(_uploadFile, _downloadFile, value.customRange)),
    copies: value.copies
  };
}
function from_candid_record_n21(_uploadFile, _downloadFile, value) {
  return {
    hasMore: value.hasMore,
    rows: from_candid_vec_n22(_uploadFile, _downloadFile, value.rows)
  };
}
function from_candid_record_n25(_uploadFile, _downloadFile, value) {
  return {
    value: from_candid_Value_n26(_uploadFile, _downloadFile, value.value),
    name: value.name
  };
}
function from_candid_record_n34(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_JobStatus_n8(_uploadFile, _downloadFile, value.status),
    printedPages: value.printedPages,
    jobId: value.jobId,
    updatedAt: value.updatedAt,
    totalPages: value.totalPages
  };
}
function from_candid_record_n37(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    paperSizes: from_candid_vec_n38(_uploadFile, _downloadFile, value.paperSizes),
    colorModes: from_candid_vec_n39(_uploadFile, _downloadFile, value.colorModes),
    speedPagesPerMinute: value.speedPagesPerMinute,
    name: value.name,
    isOnline: value.isOnline,
    description: value.description,
    openingHours: value.openingHours,
    rating: value.rating,
    location: value.location
  };
}
function from_candid_record_n42(_uploadFile, _downloadFile, value) {
  return {
    isOnline: value.isOnline,
    updatedAt: value.updatedAt,
    state: value.state,
    activeJobId: record_opt_to_undefined(from_candid_opt_n43(_uploadFile, _downloadFile, value.activeJobId)),
    printerId: value.printerId
  };
}
function from_candid_record_n7(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_JobStatus_n8(_uploadFile, _downloadFile, value.status),
    estimatedPrice: value.estimatedPrice,
    printedPages: value.printedPages,
    createdAt: value.createdAt,
    fileName: value.fileName,
    updatedAt: value.updatedAt,
    fileId: value.fileId,
    jobRef: value.jobRef,
    sizeBytes: value.sizeBytes,
    printerId: value.printerId,
    options: from_candid_PrintOptions_n9(_uploadFile, _downloadFile, value.options),
    pageCount: value.pageCount
  };
}
function from_candid_variant_n2(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: from_candid_Error_n3(_uploadFile, _downloadFile, value.err)
  } : value;
}
function from_candid_variant_n27(_uploadFile, _downloadFile, value) {
  return "int" in value ? {
    __kind__: "int",
    int: value.int
  } : "nat" in value ? {
    __kind__: "nat",
    nat: value.nat
  } : "float" in value ? {
    __kind__: "float",
    float: value.float
  } : "bool" in value ? {
    __kind__: "bool",
    bool: value.bool
  } : "null" in value ? {
    __kind__: "null",
    null: value.null
  } : "text" in value ? {
    __kind__: "text",
    text: value.text
  } : value;
}
function from_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return "FrontendOriginsNotConfigured" in value ? {
    __kind__: "FrontendOriginsNotConfigured",
    FrontendOriginsNotConfigured: value.FrontendOriginsNotConfigured
  } : "MixedSsoSources" in value ? {
    __kind__: "MixedSsoSources",
    MixedSsoSources: value.MixedSsoSources
  } : "Stale" in value ? {
    __kind__: "Stale",
    Stale: value.Stale
  } : "MalformedCandid" in value ? {
    __kind__: "MalformedCandid",
    MalformedCandid: value.MalformedCandid
  } : "AmbiguousAttribute" in value ? {
    __kind__: "AmbiguousAttribute",
    AmbiguousAttribute: value.AmbiguousAttribute
  } : "NoAttributes" in value ? {
    __kind__: "NoAttributes",
    NoAttributes: value.NoAttributes
  } : "UnknownNonce" in value ? {
    __kind__: "UnknownNonce",
    UnknownNonce: value.UnknownNonce
  } : "UntrustedSsoSource" in value ? {
    __kind__: "UntrustedSsoSource",
    UntrustedSsoSource: value.UntrustedSsoSource
  } : "MissingField" in value ? {
    __kind__: "MissingField",
    MissingField: value.MissingField
  } : "FrontendOriginMismatch" in value ? {
    __kind__: "FrontendOriginMismatch",
    FrontendOriginMismatch: value.FrontendOriginMismatch
  } : value;
}
function from_candid_variant_n47(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_AllowedExtension_n48(_uploadFile, _downloadFile, value.ok)
  } : "unsupportedExtension" in value ? {
    __kind__: "unsupportedExtension",
    unsupportedExtension: value.unsupportedExtension
  } : "tooLarge" in value ? {
    __kind__: "tooLarge",
    tooLarge: value.tooLarge
  } : "empty" in value ? {
    __kind__: "empty",
    empty: value.empty
  } : value;
}
function from_candid_vec_n22(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_vec_n23(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n23(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Cell_n24(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n38(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_PaperSize_n13(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n39(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ColorMode_n11(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n44(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_PrintJobView_n6(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n45(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_PrinterView_n36(_uploadFile, _downloadFile, x));
}
function to_candid_ColorMode_n17(_uploadFile, _downloadFile, value) {
  return value == "BlackAndWhite" ? {
    BlackAndWhite: null
  } : value == "Color" ? {
    Color: null
  } : value;
}
function to_candid_PageSelection_n18(_uploadFile, _downloadFile, value) {
  return value == "All" ? {
    All: null
  } : value == "Custom" ? {
    Custom: null
  } : value;
}
function to_candid_PaperSize_n19(_uploadFile, _downloadFile, value) {
  return value == "A3" ? {
    A3: null
  } : value == "A4" ? {
    A4: null
  } : value;
}
function to_candid_PrintOptions_n15(_uploadFile, _downloadFile, value) {
  return to_candid_record_n16(_uploadFile, _downloadFile, value);
}
function to_candid_UserRole_n5(_uploadFile, _downloadFile, value) {
  return value == "admin" ? {
    admin: null
  } : value == "user" ? {
    user: null
  } : value == "guest" ? {
    guest: null
  } : value;
}
function to_candid_record_n16(_uploadFile, _downloadFile, value) {
  return {
    colorMode: to_candid_ColorMode_n17(_uploadFile, _downloadFile, value.colorMode),
    excludedBlankPages: value.excludedBlankPages,
    pageSelection: to_candid_PageSelection_n18(_uploadFile, _downloadFile, value.pageSelection),
    paperSize: to_candid_PaperSize_n19(_uploadFile, _downloadFile, value.paperSize),
    customRange: value.customRange ? candid_some(value.customRange) : candid_none(),
    copies: value.copies
  };
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function timestampToDate(timestamp) {
  const date = new Date(Number(timestamp / 1000000n));
  return Number.isNaN(date.getTime()) ? null : date;
}
function formatDateTime(timestamp) {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return date.toLocaleString(void 0, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatPrice(rupees) {
  return `₹${Number(rupees).toLocaleString("en-IN")}`;
}
function formatBytes(bytes) {
  const value = Number(bytes);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}
function formatNumber(value) {
  return Number(value).toLocaleString();
}
function jobStatusLabel(status) {
  switch (status) {
    case "Uploaded":
      return "Uploaded";
    case "Printing":
      return "Printing";
    case "Completed":
      return "Completed";
    case "Cancelled":
      return "Cancelled";
    case "Failed":
      return "Failed";
    default:
      return "Unknown";
  }
}
function jobStatusTone(status) {
  switch (status) {
    case "Completed":
      return "success";
    case "Printing":
      return "info";
    case "Uploaded":
      return "warning";
    case "Cancelled":
    case "Failed":
      return "danger";
    default:
      return "muted";
  }
}
export {
  ColorMode as C,
  EmptyState as E,
  JobStatus as J,
  PaperSize as P,
  PageSelection as a,
  formatPrice as b,
  jobStatusTone as c,
  formatDateTime as d,
  formatNumber as e,
  formatBytes as f,
  createActor as g,
  jobStatusLabel as j,
  timestampToDate as t
};
