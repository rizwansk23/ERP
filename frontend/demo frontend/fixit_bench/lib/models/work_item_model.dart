/// Status of a job as it moves through the works pipeline.
enum WorkStatus { pending, accepted, rejected }

extension WorkStatusX on WorkStatus {
  String get label {
    switch (this) {
      case WorkStatus.pending:
        return 'Pending';
      case WorkStatus.accepted:
        return 'Accepted';
      case WorkStatus.rejected:
        return 'Rejected';
    }
  }
}

class WorkItemModel {
  final String name;
  final String service;
  final String deadline;
  String remark;
  bool processed;
  WorkStatus status;
  bool completed;
  bool delivered;

  WorkItemModel({
    required this.name,
    required this.service,
    required this.deadline,
    this.remark = '',
    this.processed = false,
    this.status = WorkStatus.pending,
    this.completed = false,
    this.delivered = false,
  });
}
