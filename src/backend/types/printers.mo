import Common "common";

module {
  /// A printer device available in the PrintHub network.
  public type Printer = {
    id : Common.PrinterId;
    name : Text;
    location : Text;
    paperSizes : [Common.PaperSize];
    colorModes : [Common.ColorMode];
    isOnline : Bool;
    openingHours : Text;
    rating : Nat;
    speedPagesPerMinute : Nat;
    description : Text;
  };

  /// Shared (serializable) view of a printer returned by the API.
  public type PrinterView = {
    id : Common.PrinterId;
    name : Text;
    location : Text;
    paperSizes : [Common.PaperSize];
    colorModes : [Common.ColorMode];
    isOnline : Bool;
    openingHours : Text;
    rating : Nat;
    speedPagesPerMinute : Nat;
    description : Text;
  };

  /// Live simulated status of a printer device.
  public type PrinterStatus = {
    printerId : Common.PrinterId;
    isOnline : Bool;
    state : Text;
    activeJobId : ?Common.JobId;
    updatedAt : Common.Timestamp;
  };

  /// Result of a simulated connect attempt.
  public type ConnectResult = {
    printerId : Common.PrinterId;
    connected : Bool;
    state : Text;
  };
};
