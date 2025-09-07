# ZDN Report Management System - API Documentation

## Overview

The ZDN Report Management System provides a RESTful API for external clients to retrieve measurement reports in a standardized canonical JSON format.

## Base URL

```
http://localhost:3001/api
```

## Authentication

All API requests require an API key for authentication. Include the API key in the request header:

```
X-API-Key: your-api-key-here
```

## Endpoints

### Get Report by Report Number

Retrieve a complete measurement report using the report number.

**Endpoint:** `GET /reports/external/{reportNo}`

**Parameters:**
- `reportNo` (string, required): The report number to search for

**Headers:**
```
X-API-Key: your-api-key-here
Content-Type: application/json
```

**Example Request:**
```bash
curl -H "X-API-Key: sample-api-key-12345" \
     "http://localhost:3001/api/reports/external/00000001"
```

**Example Request (with special characters):**
```bash
curl -H "X-API-Key: sample-api-key-12345" \
     "http://localhost:3001/api/reports/external/00000%2F00006662%2F25"
```

**Success Response (200 OK):**
```json
{
  "Message": "",
  "SendDate": "2025-09-07 15:57:07",
  "Success": true,
  "Hemjilt": {
    "ContractNo": "CONTRACT-001",
    "Customer": "M-Oil Group",
    "DischargeCommenced": "2025-08-29 11:00:00",
    "DischargeCompleted": "2025-08-29 12:15:00",
    "FullCompleted": "2025-08-29 12:15:00",
    "HandledBy": "Inspector Name",
    "HemjiltDetails": [
      {
        "ActualDensity": "0.8515",
        "ZDNMT": "61.266",
        "DensityAt20c": "0.8237",
        "DifferenceZdnRWBMT": "0",
        "DifferenceZdnRWBMTProcent": "0",
        "DipSm": "0",
        "GOVLtr": "72936",
        "RTCNo": "51389831",
        "RWBMTGross": "61.52",
        "RWBNo": "24243332",
        "SealNo": "4238841",
        "TOVltr": "72936",
        "Temperature": "21",
        "Type": "106",
        "WaterLtr": "0",
        "WaterSm": "0"
      }
    ]
  },
  "Inspector": "Z.Unen",
  "Location": "TEDSan Oil Terminal, Ulaanbaatar",
  "Object": "RTCs Inspection",
  "Product": "Gas Oil",
  "ReportDate": "2025-08-29 00:00:00",
  "ReportNo": "00000/00006662/25"
}
```

**Error Response (404 Not Found):**
```json
{
  "Message": "Report not found",
  "SendDate": "2025-09-07 15:57:07",
  "Success": false,
  "Hemjilt": {
    "ContractNo": "",
    "Customer": "",
    "DischargeCommenced": "",
    "DischargeCompleted": "",
    "FullCompleted": "",
    "HandledBy": "",
    "HemjiltDetails": []
  },
  "Inspector": "",
  "Location": "",
  "Object": "",
  "Product": "",
  "ReportDate": "",
  "ReportNo": ""
}
```

## Response Schema

### Main Response Object

| Field | Type | Description |
|-------|------|-------------|
| `Message` | string | Status message (empty for success) |
| `SendDate` | string | Timestamp when response was generated (YYYY-MM-DD HH:mm:ss) |
| `Success` | boolean | Indicates if the request was successful |
| `Hemjilt` | object | Main report data container |
| `Inspector` | string | Name of the inspector |
| `Location` | string | Location where measurement was performed |
| `Object` | string | Object description (e.g., "RTCs Inspection") |
| `Product` | string | Product type (e.g., "Gas Oil", "Diesel") |
| `ReportDate` | string | Date of the report (YYYY-MM-DD HH:mm:ss) |
| `ReportNo` | string | Unique report number |

### Hemjilt Object

| Field | Type | Description |
|-------|------|-------------|
| `ContractNo` | string | Contract number |
| `Customer` | string | Customer name |
| `DischargeCommenced` | string | Discharge start time (YYYY-MM-DD HH:mm:ss) |
| `DischargeCompleted` | string | Discharge end time (YYYY-MM-DD HH:mm:ss) |
| `FullCompleted` | string | Full completion time (YYYY-MM-DD HH:mm:ss) |
| `HandledBy` | string | Person who handled the measurement |
| `HemjiltDetails` | array | Array of measurement details |

### HemjiltDetails Array

Each item in the `HemjiltDetails` array contains:

| Field | Type | Description |
|-------|------|-------------|
| `ActualDensity` | string | Actual density measurement |
| `ZDNMT` | string | ZDN measurement |
| `DensityAt20c` | string | Density at 20°C |
| `DifferenceZdnRWBMT` | string | Difference between ZDN and RWBMT |
| `DifferenceZdnRWBMTProcent` | string | Percentage difference |
| `DipSm` | string | Dip measurement in centimeters |
| `GOVLtr` | string | Gross observed volume in liters |
| `RTCNo` | string | RTC number |
| `RWBMTGross` | string | RWBMT gross measurement |
| `RWBNo` | string | RWB number |
| `SealNo` | string | Seal number |
| `TOVltr` | string | Total observed volume in liters |
| `Temperature` | string | Temperature measurement |
| `Type` | string | Type identifier |
| `WaterLtr` | string | Water content in liters |
| `WaterSm` | string | Water measurement in centimeters |

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success - Report found and returned |
| 401 | Unauthorized - Invalid or missing API key |
| 404 | Not Found - Report number does not exist |
| 500 | Internal Server Error - Server-side error |

### Error Response Format

When an error occurs, the response will include:
- `Success: false`
- `Message`: Error description
- Empty or default values for other fields

## Rate Limiting

Currently, there are no rate limits implemented. This may be added in future versions.

## API Key Management

### Getting an API Key

Contact your system administrator to obtain an API key for accessing the ZDN Report Management System.

### API Key Security

- Keep your API key secure and do not share it
- Do not include API keys in client-side code
- Rotate your API key regularly
- Report any suspected compromise immediately

## Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function getReport(reportNo) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/reports/external/${encodeURIComponent(reportNo)}`,
      {
        headers: {
          'X-API-Key': 'your-api-key-here',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.Success) {
      console.log('Report found:', response.data);
      return response.data;
    } else {
      console.log('Report not found:', response.data.Message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching report:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
getReport('00000001')
  .then(report => {
    if (report) {
      console.log('Inspector:', report.Inspector);
      console.log('Location:', report.Location);
      console.log('Details count:', report.Hemjilt.HemjiltDetails.length);
    }
  });
```

### Python

```python
import requests
import urllib.parse

def get_report(report_no, api_key):
    url = f"http://localhost:3001/api/reports/external/{urllib.parse.quote(report_no)}"
    headers = {
        'X-API-Key': api_key,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        if data['Success']:
            print(f"Report found: {data['ReportNo']}")
            return data
        else:
            print(f"Report not found: {data['Message']}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Error fetching report: {e}")
        raise

# Usage
api_key = "your-api-key-here"
report = get_report("00000001", api_key)
if report:
    print(f"Inspector: {report['Inspector']}")
    print(f"Location: {report['Location']}")
    print(f"Details count: {len(report['Hemjilt']['HemjiltDetails'])}")
```

### cURL

```bash
#!/bin/bash

API_KEY="your-api-key-here"
REPORT_NO="00000001"
BASE_URL="http://localhost:3001/api"

# Get report
response=$(curl -s -H "X-API-Key: $API_KEY" \
                -H "Content-Type: application/json" \
                "$BASE_URL/reports/external/$REPORT_NO")

# Check if successful
success=$(echo "$response" | jq -r '.Success')

if [ "$success" = "true" ]; then
    echo "Report found:"
    echo "$response" | jq '.'
else
    echo "Report not found:"
    echo "$response" | jq -r '.Message'
fi
```

## Support

For technical support or questions about the API:

- **Email:** support@zdn.com
- **Phone:** +976-11-XXXXXX
- **Documentation:** This file

## Changelog

### Version 1.0.0 (2025-09-07)
- Initial API release
- Support for report retrieval by report number
- Canonical JSON format implementation
- API key authentication

---

**Last Updated:** September 7, 2025  
**API Version:** 1.0.0
