import { ApiDocumentFile } from '../entities/api-document-file.entity'

export class ApiDocumentFileCreatedEvent {
  constructor(
    public apiDocumentFile: ApiDocumentFile
  ) {
  }
}
