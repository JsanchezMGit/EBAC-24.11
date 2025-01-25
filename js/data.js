const baseURL = 'https://api.tvmaze.com';
const baseOptions = {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
  };

const fetchData = (endpoint, options) => fetch(`${baseURL}/${endpoint}`, options).then(response => response.json()).catch(error => console.error('Error:', error));

const getData = (endpoint) => fetchData(endpoint, baseOptions);

const formatSummary = (summaryText) => {
    let summary = 'No summary';
    if (summaryText) {
        summary = summaryText.replaceAll('<p>', '').replaceAll('</p>', '');
    }
    return summary;
};