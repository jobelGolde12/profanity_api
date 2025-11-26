import React, { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
const OtherEndpoints = () => {
  const BASE_URL = 'http://127.0.0.1:8000/api';
  
  // State for form data
  const [filipinoWord, setFilipinoWord] = useState('');
  const [regionalWord, setRegionalWord] = useState('');
  const [updateFilipinoId, setUpdateFilipinoId] = useState('');
  const [updateFilipinoWord, setUpdateFilipinoWord] = useState('');
  const [updateRegionalId, setUpdateRegionalId] = useState('');
  const [updateRegionalWord, setUpdateRegionalWord] = useState('');
  const [deleteFilipinoId, setDeleteFilipinoId] = useState('');
  const [deleteRegionalId, setDeleteRegionalId] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('json');

  // Handle API calls
  const callApi = async (url, method = 'POST', data = null) => {
    setLoading(true);
    setResponse(null);
    
    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': format === 'xml' ? 'application/xml' : 'application/json',
        },
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
      }

      // Add format parameter to URL
      const urlWithFormat = `${url}?format=${format}`;
      
      const res = await fetch(urlWithFormat, config);
      const text = await res.text();
      
      let parsedResponse;
      if (format === 'xml') {
        parsedResponse = { xml: text, status: res.status };
      } else {
        parsedResponse = { ...JSON.parse(text), status: res.status };
      }
      
      setResponse(parsedResponse);
    } catch (error) {
      setResponse({
        error: `API call failed: ${error.message}`,
        status: 500
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler functions
  const handleStoreFilipino = (e) => {
    e.preventDefault();
    if (!filipinoWord.trim()) {
      setResponse({ error: 'Word is required', status: 400 });
      return;
    }
    callApi(`${BASE_URL}/profanity/filipino`, 'POST', { word: filipinoWord });
    setFilipinoWord('');
  };

  const handleStoreRegional = (e) => {
    e.preventDefault();
    if (!regionalWord.trim()) {
      setResponse({ error: 'Word is required', status: 400 });
      return;
    }
    callApi(`${BASE_URL}/profanity/regional`, 'POST', { word: regionalWord });
    setRegionalWord('');
  };

  const handleUpdateFilipino = (e) => {
    e.preventDefault();
    if (!updateFilipinoId || !updateFilipinoWord.trim()) {
      setResponse({ error: 'ID and word are required', status: 400 });
      return;
    }
    callApi(`${BASE_URL}/profanity/filipino/${updateFilipinoId}`, 'PUT', { 
      word: updateFilipinoWord 
    });
    setUpdateFilipinoId('');
    setUpdateFilipinoWord('');
  };

  const handleUpdateRegional = (e) => {
    e.preventDefault();
    if (!updateRegionalId || !updateRegionalWord.trim()) {
      setResponse({ error: 'ID and word are required', status: 400 });
      return;
    }
    callApi(`${BASE_URL}/profanity/regional/${updateRegionalId}`, 'PUT', { 
      word: updateRegionalWord 
    });
    setUpdateRegionalId('');
    setUpdateRegionalWord('');
  };

  const handleDeleteFilipino = (e) => {
    e.preventDefault();
    if (!deleteFilipinoId) {
      setResponse({ error: 'ID is required', status: 400 });
      return;
    }
    callApi(`${BASE_URL}/profanity/filipino/${deleteFilipinoId}`, 'DELETE');
    setDeleteFilipinoId('');
  };

  const handleDeleteRegional = (e) => {
    e.preventDefault();
    if (!deleteRegionalId) {
      setResponse({ error: 'ID is required', status: 400 });
      return;
    }
    callApi(`${BASE_URL}/profanity/regional/${deleteRegionalId}`, 'DELETE');
    setDeleteRegionalId('');
  };

  return (
    <GuestLayout>
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profanity API Endpoints
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Manage Filipino and Regional profanity words
          </p>
          <div className="flex justify-center items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Response Format:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setFormat('json')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  format === 'json'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                JSON
              </button>
              <button
                onClick={() => setFormat('xml')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  format === 'xml'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                XML
              </button>
            </div>
          </div>
        </div>

        {/* Response Display */}
        {response && (
          <div className={`mb-6 p-4 rounded-lg border ${
            response.status >= 400 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`font-medium ${
                response.status >= 400 ? 'text-red-800' : 'text-green-800'
              }`}>
                Response {response.status}
              </span>
              <button
                onClick={() => setResponse(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
              {format === 'xml' && response.xml 
                ? response.xml 
                : JSON.stringify(response, null, 2)
              }
            </pre>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Filipino Words Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Filipino Words
              </h2>
              
              {/* Create Filipino Word */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Add New Filipino Word</h3>
                <form onSubmit={handleStoreFilipino} className="space-y-3">
                  <input
                    type="text"
                    value={filipinoWord}
                    onChange={(e) => setFilipinoWord(e.target.value)}
                    placeholder="Enter Filipino word"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Filipino Word'}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  POST: {BASE_URL}/profanity/filipino
                </p>
              </div>

              {/* Update Filipino Word */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Update Filipino Word</h3>
                <form onSubmit={handleUpdateFilipino} className="space-y-3">
                  <input
                    type="number"
                    value={updateFilipinoId}
                    onChange={(e) => setUpdateFilipinoId(e.target.value)}
                    placeholder="Word ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={updateFilipinoWord}
                    onChange={(e) => setUpdateFilipinoWord(e.target.value)}
                    placeholder="New word"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Filipino Word'}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  PUT: {BASE_URL}/profanity/filipino/&#123;id&#125;
                </p>
              </div>

              {/* Delete Filipino Word */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Delete Filipino Word</h3>
                <form onSubmit={handleDeleteFilipino} className="space-y-3">
                  <input
                    type="number"
                    value={deleteFilipinoId}
                    onChange={(e) => setDeleteFilipinoId(e.target.value)}
                    placeholder="Word ID to delete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete Filipino Word'}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  DELETE: {BASE_URL}/profanity/filipino/&#123;id&#125;
                </p>
              </div>
            </div>
          </div>

          {/* Regional Words Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Regional Words
              </h2>
              
              {/* Create Regional Word */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Add New Regional Word</h3>
                <form onSubmit={handleStoreRegional} className="space-y-3">
                  <input
                    type="text"
                    value={regionalWord}
                    onChange={(e) => setRegionalWord(e.target.value)}
                    placeholder="Enter Regional word"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Regional Word'}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  POST: {BASE_URL}/profanity/regional
                </p>
              </div>

              {/* Update Regional Word */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Update Regional Word</h3>
                <form onSubmit={handleUpdateRegional} className="space-y-3">
                  <input
                    type="number"
                    value={updateRegionalId}
                    onChange={(e) => setUpdateRegionalId(e.target.value)}
                    placeholder="Word ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={updateRegionalWord}
                    onChange={(e) => setUpdateRegionalWord(e.target.value)}
                    placeholder="New word"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Regional Word'}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  PUT: {BASE_URL}/profanity/regional/&#123;id&#125;
                </p>
              </div>

              {/* Delete Regional Word */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Delete Regional Word</h3>
                <form onSubmit={handleDeleteRegional} className="space-y-3">
                  <input
                    type="number"
                    value={deleteRegionalId}
                    onChange={(e) => setDeleteRegionalId(e.target.value)}
                    placeholder="Word ID to delete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete Regional Word'}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  DELETE: {BASE_URL}/profanity/regional/&#123;id&#125;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-700">Processing request...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </GuestLayout>
  );
};

export default OtherEndpoints;