import OQL "mo:caffeineai-oql";

module {
  /// Convert a job status variant to a queryable text value.
  public func _toRow(self : {
    #Uploaded;
    #Printing;
    #Completed;
    #Cancelled;
    #Failed;
  }) : OQL.Value {
    #text(
      switch self {
        case (#Uploaded) "Uploaded";
        case (#Printing) "Printing";
        case (#Completed) "Completed";
        case (#Cancelled) "Cancelled";
        case (#Failed) "Failed";
      }
    );
  };
};
