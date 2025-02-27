const defaultFields = {
    static_websites : {
      websiteTypeDescription: `<h4>What is a Static Website?</h4>
                <p>A static website is a type of site with fixed content that does not change dynamically. It is simple, fast, and cost-effective, ideal for showcasing basic information.</p>
                <h5>Key Features: </h5>
                <ul class="feature-description">
                    <li>Built using HTML, CSS, and sometimes JavaScript.  </li>
                    <li>Fixed content; no interaction-based updates.  </li>
                    <li>Quick loading and lightweight structure. </li>
                    <li>Ideal for small-scale businesses, portfolios, or informational purposes. </li>
                    <li> Cost-friendly and time saving. </li>
                  </ul>`
    },
    standard_websites: {
     websiteTypeDescription: `<h4>What is a Standard Website?</h4>
                <p>A standard website is a hybrid between static and dynamic websites. It combines static elements with some dynamic features that allow specific sections or pages to be updated without requiring full reloading. Technologies such as HTML, CSS, JS, Node.js, Express, and databases like MongoDB or Firebase are commonly used to build such websites.</p>
                <h5>Key Features: </h5>
                <ul class="feature-description">
                    <li><b>Cost-Effective:</b> More affordable than fully dynamic websites.</li>
                    <li><b>User-Friendly Configuration:</b> Allows users to manage and configure certain website elements. </li>
                    <li><b>Customizable:</b> Provides flexibility to add custom features and functionalities.</li>
                    <li><b>Fast Loading:</b> Lightweight design ensures quick loading times.</li>
                    <li><b>Easy Maintenance:</b> Simpler to maintain than complex dynamic sites. </li>
                    <li><b>Scalability:</b> Can be easily expanded or updated with minimal effort.  </li>
                    <li><b>Secure:</b> Fewer security vulnerabilities than fully dynamic sites.</li>
                    <li><b>Improved Performance:</b> Combines the efficiency of static content with dynamic interactions.  </li>
                    <li><b>Reduced Hosting Costs:</b> Requires less server power compared to fully dynamic sites.  </li>
                    <li><b>Seamless Updates:</b> Allows selective updates without affecting the entire website.</li>
                  </ul>`
    },
    dynamic_websites: {
     websiteTypeDescription: ` <h4>What is a Dynamic Website?  </h4>
                <p>A dynamic website is a web application created using frameworks such as React, PHP, Node.js, Angular, or Django. These websites allow users to update and manage content through an admin panel without needing any coding skills, making it easier to keep the site fresh and relevant.</p>
                <h5>Key Benefits: </h5>
                <div class="feature-list-items">
                    <ul class="feature-description">
                        <li>Automation</li>
                        <li>User-controlled Updates  </li>
                        <li>Fast Performance  </li>
                        <li>Data Integrity</li>
                    </ul>
                    <ul class="feature-description">
                        <li>Scalability</li>
                        <li>Customizable Features</li>
                        <li>Easy to Maintain</li>
                        <li>Enhanced Interactivity</li>
                    </ul>
                </div>
                <h5>Cons: </h5>
                <ul class="feature-description">
                    <li>Higher Cost  </li>
                    </ul>`
    },
    feature_upgrades: {
        websiteTypeDescription: ` <h4>Our Objective</h4>
                   <pTo provide you with a professional, user-friendly, and efficient gallery solution that enhances your website's visual appeal and user engagement. We ensure seamless integration, optimal performance, and complete satisfaction with our development services.</p>`
       },
    // Add more categories as needed
  };

  export default defaultFields