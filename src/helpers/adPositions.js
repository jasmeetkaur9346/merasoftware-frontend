const adPositions = {
    pages: [
      { id: 1, label: "Home Page", url: "/" },
      { id: 2, label: "Products Page" },
      { id: 3, label: "About Page" },
      { id: 4, label: "Contact Page" }
    ],
  
    sections: {
      "Home Page": [
        { id: 1, label: "Header Section" },
        { id: 2, label: "Main Slider" },
        { id: 3, label: "Sidebar" },
        { id: 4, label: "Footer" }
      ],
      "Products Page": [
        { id: 1, label: "Top Section" },
        { id: 2, label: "Between Products" },
        { id: 3, label: "Sidebar" }
      ]
    },
  
    positions: {
      "Header Section": [
        { id: 1, label: "Top" },
        { id: 2, label: "Bottom" }
      ],
      "Main Slider": [
        { id: 1, label: "First" },
        { id: 2, label: "Middle" },
        { id: 3, label: "Last" }
      ],
      "Sidebar": [
        { id: 1, label: "Top" },
        { id: 2, label: "Middle" },
        { id: 3, label: "Bottom" }
      ]
    }
  };
  
  export default adPositions;