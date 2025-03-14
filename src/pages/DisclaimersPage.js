import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const DisclaimersPage = () => {
  // Reference to the content for PDF export
  const contentRef = React.useRef(null);
  
  // Function to generate and download PDF
  const downloadPDF = async () => {
    const content = contentRef.current;
    if (!content) return;
    
    try {
      // Show loading state
      const button = document.getElementById('download-btn');
      const originalText = button.textContent;
      button.textContent = 'Generating PDF...';
      button.disabled = true;
      
      // Use html2canvas to capture the content
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
      });
      
      // Calculate dimensions for A4 format
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Handle multiple pages if needed
      if (imgHeight > pdf.internal.pageSize.height) {
        let heightLeft = imgHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.height;
        
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      // Save the PDF
      pdf.save('Disclaimers.pdf');
      
      // Reset button state
      button.textContent = originalText;
      button.disabled = false;
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      
      // Reset button on error
      const button = document.getElementById('download-btn');
      if (button) {
        button.textContent = 'Download PDF Copy';
        button.disabled = false;
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Main content container with reference for PDF export */}
        <div ref={contentRef} className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-green-700 py-6 px-8">
            <h1 className="text-3xl font-bold text-white">Disclaimers</h1>
            <p className="mt-2 text-green-100">Last updated: March 14, 2025</p>
          </div>
          
          {/* Introduction */}
          <div className="py-8 px-8">
            <div className="text-gray-600 leading-relaxed mb-8">
              <p>
                While we strive to provide the best service possible, there are certain limitations to our responsibilities. 
                The following disclaimers outline the boundaries of our services and help establish clear expectations for our clients.
              </p>
            </div>
            
            {/* Section 1 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 mr-3">1</span>
                Delays Due to Client Factors
              </h2>
              <div className="mt-4 pl-11 text-gray-600 leading-relaxed">
                <p>
                  We are not responsible for delays caused due to the customer's failure to provide necessary data or payments on time. 
                  Project timelines are established with the assumption of timely client cooperation and input.
                </p>
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-amber-700">
                      Delays caused by late provision of content, assets, approvals, or payments will extend project timelines accordingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section 2 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 mr-3">2</span>
                Documentation of Agreements
              </h2>
              <div className="mt-4 pl-11 text-gray-600 leading-relaxed">
                <p>
                  We ensure that all agreements and project scopes are properly documented before starting the work to avoid 
                  any confusion or disputes. This documentation serves as the definitive reference for project expectations.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mx-auto mb-3">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-center font-medium text-gray-700 mb-2">Project Scope</h3>
                    <p className="text-sm text-gray-500 text-center">
                      Detailed documentation of features, functionalities, and deliverables.
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mx-auto mb-3">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-center font-medium text-gray-700 mb-2">Timeline</h3>
                    <p className="text-sm text-gray-500 text-center">
                      Agreed-upon milestones and delivery dates based on project requirements.
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mx-auto mb-3">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-center font-medium text-gray-700 mb-2">Payment Terms</h3>
                    <p className="text-sm text-gray-500 text-center">
                      Clear payment schedule and amounts for project phases.
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500 italic">
                  Any changes to the scope, timeline, or deliverables must be documented in writing and agreed upon by both parties.
                </p>
              </div>
            </div>
            
            {/* Section 3 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 mr-3">3</span>
                Third-Party Services and Integrations
              </h2>
              <div className="mt-4 pl-11 text-gray-600 leading-relaxed">
                <p>
                  While we provide support to our clients, we do not take responsibility for issues caused by third-party services, 
                  software updates, or integrations that are beyond our control.
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-600">
                      <strong>API Changes:</strong> Changes to third-party APIs may affect functionality and require additional development work.
                    </p>
                  </div>
                  <div className="flex p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-600">
                      <strong>Plugin/Library Updates:</strong> Updates to plugins or libraries may cause compatibility issues requiring maintenance.
                    </p>
                  </div>
                  <div className="flex p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-600">
                      <strong>Hosting Service Issues:</strong> Server downtime or issues with hosting providers are outside our direct control.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section 4 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 mr-3">4</span>
                Maintenance and Support
              </h2>
              <div className="mt-4 pl-11 text-gray-600 leading-relaxed">
                <p>
                  Ongoing maintenance and support services are provided as per the agreed terms in the service contract. 
                  Any support requests beyond the scope of the agreement may incur additional charges.
                </p>
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Support Coverage</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="flex items-center px-4 py-3">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-sm text-gray-600">Bug fixes for issues within our codebase</span>
                    </div>
                    <div className="flex items-center px-4 py-3">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-sm text-gray-600">Technical support during agreed business hours</span>
                    </div>
                    <div className="flex items-center px-4 py-3">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-sm text-gray-600">Major feature additions or changes</span>
                    </div>
                    <div className="flex items-center px-4 py-3">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-sm text-gray-600">Issues with third-party services or integrations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section 5 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 mr-3">5</span>
                Transparency and Fairness
              </h2>
              <div className="mt-4 pl-11 text-gray-600 leading-relaxed">
                <p>
                  Our system is designed to be transparent and fair, ensuring a smooth experience for every client. 
                  We strive to maintain clear communication and set realistic expectations throughout the project lifecycle.
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <div className="py-6 px-6 bg-green-50 rounded-xl max-w-lg">
                    <div className="flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                    <p className="text-center text-gray-700 font-medium">
                      We value our client relationships and are committed to being fair, honest, and transparent in all our business dealings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Last updated date */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="text-gray-500 text-sm">
                Last updated: March 14, 2025
              </div>
            </div>
          </div>
        </div>
        
        {/* PDF Download button outside the main content */}
        <div className="flex justify-center">
          <button 
            id="download-btn"
            onClick={downloadPDF}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimersPage;