export interface OperationLog {
  _id: string;
  operation_type: 'UPDATE' | 'CREATE' | 'DELETE' | "ARCHIVE";
  collection_name: string;
  undo_data: Array<{
    document_id: string;
    previous_version: any | null;
    actual_version: any | null;
  }>;
  undo_status: boolean;
  dependencies: Array<string>;
  thread_id?: string;
  user_id: string;
}