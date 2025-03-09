const audienceData = [{
    "id": 1,
    "first_name": "Gwenora",
    "last_name": "Rippingale",
    "email": "grippingale0@chronoengine.com",
    "company": "Leenti",
    "phone": "956-219-2675",
    "occupation": "Mechanical Systems Engineer",
    "timestamp": "4 hours ago",
    "isChecked": false
  }, {
    "id": 27,
    "first_name": "Hephzibah",
    "last_name": "Cranefield",
    "email": "hcranefieldq@columbia.edu",
    "company": "Vitz",
    "phone": "399-424-6733",
    "occupation": "Computer Systems Analyst IV",
    "timestamp": "3 hours ago",
    "isChecked": true
  }, {
    "id": 28,
    "first_name": "Richart",
    "last_name": "Hatherleigh",
    "email": "rhatherleighr@goodreads.com",
    "company": "Tagopia",
    "phone": "338-334-9536",
    "occupation": "Software Consultant",
    "timestamp": "3 hours ago",
    "isChecked": false
  }, {
    "id": 29,
    "first_name": "Adolf",
    "last_name": "Gaddie",
    "email": "agaddies@macromedia.com",
    "company": "InnoZ",
    "phone": "592-498-6180",
    "occupation": "Staff Accountant I",
    "timestamp": "3 hours ago",
    "isChecked": true
  }]

const companyData = [{
    "id": 1,
    "email": "mtremble0@lycos.com",
    "company": "Photobug",
    "phone": "124-929-7416",
    "isChecked": false,
    "address": "Room 913",
    "contactPerson": "Maren Tremble"
  },{
    "id": 12,
    "email": "mcribbinb@smugmug.com",
    "company": "Edgepulse",
    "phone": "194-400-3589",
    "isChecked": false,
    "address": "Room 610",
    "contactPerson": "Mattie Cribbin"
  }]

  const taskData = [{
    "id": 1,
    "taskName": "Responsive Website Design",
    "status": "Completed",
    "startDate": "3/31/2023",
    "dueDate": "5/23/2023",
    "assignedTo": "Isador Crippes",
    "priority": "Low"
  }, {
    "id": 2,
    "taskName": "Responsive Website Design",
    "status": "On Hold",
    "startDate": "9/16/2022",
    "dueDate": "3/20/2023",
    "assignedTo": "Robinetta Lilleyman",
    "priority": "High"
  },  {
    "id": 12,
    "taskName": "Website Design & Implementation",
    "status": "Completed",
    "startDate": "3/1/2023",
    "dueDate": "8/9/2022",
    "assignedTo": "Berenice Ledingham",
    "priority": "Low"
  }, {
    "id": 13,
    "taskName": "Search Functionality Development",
    "status": "Not Started",
    "startDate": "6/4/2023",
    "dueDate": "3/30/2023",
    "assignedTo": "Abbe Bilbrooke",
    "priority": "Urgent"
  }]

  const leadsData = [{
    "id": 1,
    "name": "Shellysheldon Saulter",
    "address": "19th Floor",
    "phone": "906-243-4301",
    "email": "ssaulter0@va.gov",
    "company": "Linkbuzz",
    "description": "Reopen laminectomy site"
  }, {
    "id": 2,
    "name": "Ethelda Birchett",
    "address": "Room 343",
    "phone": "663-267-4916",
    "email": "ebirchett1@cbc.ca",
    "company": "Eire",
    "description": "Open bx saliv gland/duct"
  }, {
    "id": 3,
    "name": "Gordon Walkling",
    "address": "Apt 1193",
    "phone": "191-361-3240",
    "email": "gwalkling2@slideshare.net",
    "company": "Thoughtworks",
    "description": "Lg bowel segment isolat"
  }, {
    "id": 13,
    "name": "Kristal Leah",
    "address": "Apt 1457",
    "phone": "242-252-6953",
    "email": "kleahc@shop-pro.jp",
    "company": "Eayo",
    "description": "Destruction tongue les"
  }]

  const customerData = [{
    "customerId": 1,
    "name": "Gerome Asaaf",
    "phone": "563-911-9740",
    "group": "Group 4",
    "customerType": 4,
    "creditLimit": 14430.38,
    "openingBalance": 4463.05,
    "debit": "complete",
    "credit": "complete",
    "closingBalance": "incomplete",
    "isChecked": false
  }, {
    "customerId": 15,
    "name": "Fidole Kimble",
    "phone": "189-201-7729",
    "group": "Group 5",
    "customerType": 4,
    "creditLimit": 14891.13,
    "openingBalance": 2601.15,
    "debit": "complete",
    "credit": "incomplete",
    "closingBalance": "incomplete",
    "isChecked": true
  }, {
    "customerId": 16,
    "name": "Milty Tempest",
    "phone": "461-655-9307",
    "group": "Group 2",
    "customerType": 1,
    "creditLimit": 10891.02,
    "openingBalance": 4825.18,
    "debit": "complete",
    "credit": "complete",
    "closingBalance": "complete",
    "isChecked": true
  }, {
    "customerId": 17,
    "name": "Ardenia Ottewell",
    "phone": "374-643-1568",
    "group": "Group 4",
    "customerType": 4,
    "creditLimit": 14200.25,
    "openingBalance": 4569.85,
    "debit": "complete",
    "credit": "complete",
    "closingBalance": "complete",
    "isChecked": false
  }, {
    "customerId": 18,
    "name": "Jodie Dyment",
    "phone": "248-189-1180",
    "group": "Group 4",
    "customerType": 2,
    "creditLimit": 14299.99,
    "openingBalance": 3899.55,
    "debit": "complete",
    "credit": "complete",
    "closingBalance": "complete",
    "isChecked": true
  }, {
    "customerId": 19,
    "name": "Laurella Loveard",
    "phone": "196-759-2371",
    "group": "Group 1",
    "customerType": 5,
    "creditLimit": 10484.78,
    "openingBalance": 1989.07,
    "debit": "incomplete",
    "credit": "incomplete",
    "closingBalance": "incomplete",
    "isChecked": false
  }, {
    "customerId": 20,
    "name": "Lib Buck",
    "phone": "789-698-1184",
    "group": "Group 4",
    "customerType": 2,
    "creditLimit": 13898.9,
    "openingBalance": 807.72,
    "debit": "incomplete",
    "credit": "incomplete",
    "closingBalance": "incomplete",
    "isChecked": true
  }, {
    "customerId": 21,
    "name": "Suzanna Barnfather",
    "phone": "386-462-6130",
    "group": "Group 4",
    "customerType": 4,
    "creditLimit": 11345.57,
    "openingBalance": 1490.85,
    "debit": "complete",
    "credit": "complete",
    "closingBalance": "incomplete",
    "isChecked": false
  }, {
    "customerId": 22,
    "name": "Hedi Rubenczyk",
    "phone": "393-389-2148",
    "group": "",
    "customerType": 5,
    "creditLimit": 11849.47,
    "openingBalance": 2749.23,
    "debit": "complete",
    "credit": "complete",
    "closingBalance": "complete",
    "isChecked": true
  }, {
    "customerId": 23,
    "name": "Dode Ramage",
    "phone": "788-230-4043",
    "group": "Group 1",
    "customerType": 5,
    "creditLimit": 14911.08,
    "openingBalance": 2663.9,
    "debit": "complete",
    "credit": "incomplete",
    "closingBalance": "incomplete",
    "isChecked": false
  }, {
    "customerId": 24,
    "name": "Oralia Burbridge",
    "phone": "446-526-6705",
    "group": "Group 5",
    "customerType": 4,
    "creditLimit": 11213.8,
    "openingBalance": 1331.1,
    "debit": "incomplete",
    "credit": "complete",
    "closingBalance": "complete",
    "isChecked": true
  }, {
    "customerId": 25,
    "name": "Raven Beardwood",
    "phone": "985-222-5895",
    "group": "Group 1",
    "customerType": 5,
    "creditLimit": 11645.61,
    "openingBalance": 3454.87,
    "debit": "incomplete",
    "credit": "incomplete",
    "closingBalance": "complete",
    "isChecked": false
  }, {
    "customerId": 26,
    "name": "Thorndike Bowditch",
    "phone": "857-273-8457",
    "group": "Group 2",
    "customerType": 1,
    "creditLimit": 10373.98,
    "openingBalance": 4674.29,
    "debit": "incomplete",
    "credit": "complete",
    "closingBalance": "incomplete",
    "isChecked": true
  }, {
    "customerId": 27,
    "name": "Cullie Blankley",
    "phone": "554-800-9461",
    "group": "Group 5",
    "customerType": 5,
    "creditLimit": 14715.37,
    "openingBalance": 3620.71,
    "debit": "complete",
    "credit": "complete",
    "closingBalance": "complete",
    "isChecked": false
  }, {
    "customerId": 28,
    "name": "Quincey Ellson",
    "phone": "439-904-8446",
    "group": "",
    "customerType": 3,
    "creditLimit": 13418.09,
    "openingBalance": 1832.25,
    "debit": "complete",
    "credit": "incomplete",
    "closingBalance": "complete",
    "isChecked": true
  }, {
    "customerId": 29,
    "name": "Hadria Frontczak",
    "phone": "825-393-4703",
    "group": "Group 4",
    "customerType": 4,
    "creditLimit": 11488.16,
    "openingBalance": 4629.65,
    "debit": "complete",
    "credit": "incomplete",
    "closingBalance": "incomplete",
    "isChecked": true
  }, {
    "customerId": 30,
    "name": "Aldus Spellward",
    "phone": "372-741-9380",
    "group": "Group 5",
    "customerType": 5,
    "creditLimit": 10057.02,
    "openingBalance": 634.87,
    "debit": "incomplete",
    "credit": "complete",
    "closingBalance": "complete",
    "isChecked": false
  }]
  
  const employeeData = [{
    "image":"assets/images/avatar-2.png",
    "employeeId": 149218,
    "name": "Jelene Largan",
    "section": "Data Science",
    "phone": "228-134-8273",
    "presentAddress": "8 Service Junction"
  },  {
    "image":"assets/images/avatar-2.png",
    "employeeId": 125345,
    "name": "Hyatt Crane",
    "section": "Artificial Intelligence",
    "phone": "352-588-1389",
    "presentAddress": "322 Spohn Point"
  }]

  const attendanceData = [{
    "date": "10/18/2022",
    "name": "Trev Chrstine",
    "employeeId": 44287,
    "division": "Services Division",
    "shift": "B"
  },  {
    "date": "3/10/2023",
    "name": "Daloris Yair",
    "employeeId": 47887,
    "division": "Accounting Division",
    "shift": "B"
  }, {
    "date": "4/19/2023",
    "name": "Blythe Cowthart",
    "employeeId": 46698,
    "division": "Sound Division",
    "shift": "C"
  },{
    "date": "6/29/2022",
    "name": "Herman MacKerley",
    "employeeId": 44248,
    "division": "Art Department Division",
    "shift": "D"
  }, {
    "date": "7/5/2022",
    "name": "Roanne Pantlin",
    "employeeId": 48003,
    "division": "Services Division",
    "shift": "C"
  }, {
    "date": "12/28/2022",
    "name": "Gipsy Adamec",
    "employeeId": 45103,
    "division": "Script Division",
    "shift": "C"
  }]

  const allCustomerData = [{
    "name": "Bordie Ferre",
    "userName": "bferre0",
    "lastActive": "3/10/2023",
    "dateRegistered": "10/4/2022",
    "email": "bferre0@elpais.com",
    "orders": 9,
    "totalSpent": 172.46,
    "city": "Rangpur",
    "postalCode": 12569,
    "aov": 308.1
  }, {
    "name": "Lacee Peaple",
    "userName": "lpeapleb",
    "lastActive": "5/9/2023",
    "dateRegistered": "6/30/2022",
    "email": "lpeapleb@upenn.edu",
    "orders": 1,
    "totalSpent": 203.14,
    "city": "Chattogram",
    "postalCode": 12550,
    "aov": 266.6
  }]

  const allProductData = [{
    "id":1,
    "product_name": "Amazon Fire Tablet",
    "category": "Electronics",
    "sku": 16931,
    "image": "assets/images/product-12.jpg",
    "stock": 50,
    "price": 588,
    "sales": 623,
    "rating": 176,
    "published": "11/1/2022"
  },  {
    "id":12,
    "product_name": "Keycron Mechanical Keyboard",
    "category": "Electronics",
    "sku": 16424,
    "image": "assets/images/keyboard.jpg",
    "stock": 42,
    "price": 307,
    "sales": 435,
    "rating": 101,
    "published": "6/24/2022"
  }]
  const allProductData1 = [{
    "id":1,
    "transactionId": 1,
    "userName": "bferre0",
    "service": "Amazon Fire Tablet",
    "servicePrice": 588,
    "amountPaid": 588,
    "paymentStatus": "pending",
    "paymentMode": "cash",
    "saleDate": "11/1/2022",
    "remarks": "None",
    "transactionType": "sale",
    "quantity": 1
  },
  {
    "id":2,
    "transactionId": 2,
    "userName": "bferre0",
    "service": "Amazon Fire Tablet",
    "servicePrice": 588,
    "amountPaid": 588,
    "paymentStatus": "pending",
    "paymentMode": "cash",
    "saleDate": "11/1/2022",
    "remarks": "None",
    "transactionType": "sale",
    "quantity": 1
  }
]

  const categoryData = [{
    "id":1,
    "category_name": "Electronics",
    "description": "Laceration w/o foreign body of unsp upper arm, init encntr",
    "slug": "Electronics",
    "count": 23,
    "image":"assets/images/image.png" 
  }, {
    "id":6,
    "category_name": "Fashion",
    "description": "Activity, furniture building and finishing",
    "slug": "Fashion",
    "count": 19,
    "image":"assets/images/image.png" 
  }]

  const orderListData = [{
    "order_id": 22120150,
    "customer_name": "Torey O'Hearn",
    "status": "Hold",
    "product_number": 29,
    "price": 669,
    "badge": "bg-danger",
    "delivery_status": "Canceled",
    "order_date": "4/21/2023",
    "payment_method": "Cash on"
  },  {
    "order_id": 22120168,
    "customer_name": "Wilmar Andreasson",
    "status": "Hold",
    "product_number": 28,
    "price": 522,
    "badge": "bg-success",
    "delivery_status": "Delivered",
    "order_date": "11/8/2022",
    "payment_method": "Paypal"
  }]
 
  const emailData = [{
    "id": 1,
    "name": "Shelley Onn",
    "email_content": "Burn of second degree of multiple sites of right ankle and foot, subsequent encounter"
  },  {
    "id": 8,
    "name": "Felisha Becom",
    "email_content": "Cutaneous myiasis"
  },{
    "id": 13,
    "name": "Marleah Arnli",
    "email_content": "Dermatopolymyositis, unspecified"
  }, {
    "id": 14,
    "name": "Chick Gronaver",
    "email_content": "Other intervertebral disc disorders, thoracic region"
  }, {
    "id": 15,
    "name": "Reyna Esch",
    "email_content": "Myositis ossificans progressiva, left shoulder random text other unspecified, medial of roght finger encounter rapid action"
  }]

  const chartData  = [
    { name: 'Jan', Desktops: 10 },
    { name: 'Feb', Desktops: 41 },
    { name: 'Mar', Desktops: 35 },
    { name: 'Apr', Desktops: 51 },
    { name: 'May', Desktops: 49 },
    { name: 'Jun', Desktops: 62 },
    { name: 'Jul', Desktops: 69 },
    { name: 'Aug', Desktops: 91 },
    { name: 'Sep', Desktops: 148 },
  ];

  const mixedChartData = [
    { date: '01/01/2003', 'TEAM A': 23, 'TEAM B': 44, 'TEAM C': 30 },
    { date: '02/01/2003', 'TEAM A': 11, 'TEAM B': 55, 'TEAM C': 25 },
    { date: '03/01/2003', 'TEAM A': 22, 'TEAM B': 41, 'TEAM C': 36 },
    { date: '04/01/2003', 'TEAM A': 27, 'TEAM B': 67, 'TEAM C': 30 },
    { date: '05/01/2003', 'TEAM A': 13, 'TEAM B': 22, 'TEAM C': 45 },
    { date: '06/01/2003', 'TEAM A': 22, 'TEAM B': 43, 'TEAM C': 35 },
    { date: '07/01/2003', 'TEAM A': 37, 'TEAM B': 21, 'TEAM C': 64 },
    { date: '08/01/2003', 'TEAM A': 21, 'TEAM B': 41, 'TEAM C': 52 },
    { date: '09/01/2003', 'TEAM A': 44, 'TEAM B': 56, 'TEAM C': 59 },
    { date: '10/01/2003', 'TEAM A': 22, 'TEAM B': 27, 'TEAM C': 36 },
    { date: '11/01/2003', 'TEAM A': 30, 'TEAM B': 43, 'TEAM C': 39 },
  ];
  
  const monthlyPlans = [
    {
      title: "Lean",
      price: 120,
    },
    {
      title: "Standard",
      price: 450,
    },
    {
      title: "Advanced",
      price: 780,
    },
    {
      title: "Enterprise",
      price: 150,
    },
  ];
  const yearlyPlans = [
    {
      title: "Lean",
      price: 1440,
    },
    {
      title: "Standard",
      price: 5400,
    },
    {
      title: "Advanced",
      price: 9360,
    },
    {
      title: "Enterprise",
      price: 1800,
    },
  ];

  const monthlyDiscountPlans = [
    {
      title: "Lean",
      price: 108,
    },
    {
      title: "Standard",
      price: 405,
    },
    {
      title: "Advanced",
      price: 702,
    },
    {
      title: "Enterprise",
      price: 135,
    },
  ];
  const yearlyDiscountPlans = [
    {
      title: "Lean",
      price: 1296,
    },
    {
      title: "Standard",
      price: 4860,
    },
    {
      title: "Advanced",
      price: 8424,
    },
    {
      title: "Enterprise",
      price: 1620,
    },
  ];
  
  export {
    audienceData, 
    companyData, 
    taskData, 
    leadsData, 
    customerData, 
    employeeData, 
    attendanceData,
    allCustomerData,
    allProductData,
    allProductData1,
    categoryData,
    orderListData,
    emailData,
    chartData,
    mixedChartData,
    monthlyPlans,
    yearlyPlans,
    monthlyDiscountPlans,
    yearlyDiscountPlans
  }