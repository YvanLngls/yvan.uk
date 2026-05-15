export const checksums = {
  "journal": "v3.5.0--8rWhI10588XCDhZEmzwfAGb7sw4R8Y8Pa51IthOioVE"
}
export const checksumsStructure = {
  "journal": "kQIHZFNLkSHJRqK05DATkNXSGm9X8XSHQhSph3TR5M4"
}

export const tables = {
  "journal": "_content_journal",
  "info": "_content_info"
}

export default {
  "journal": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "json",
      "date": "string",
      "description": "string",
      "extension": "string",
      "meta": "json",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string"
    }
  },
  "info": {
    "type": "data",
    "fields": {}
  }
}