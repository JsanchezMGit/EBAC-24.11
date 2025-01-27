const baseURL = 'https://api.tvmaze.com';

const getData = (endpoint) => axios.get(`${baseURL}/${endpoint}`).then(response => response.data).catch(error => console.error('Ocurrio un error en la consulta de la API', error));

const formatSummary = (summaryText) => {
    let summary = 'No summary';
    if (summaryText) {
        summary = summaryText.replaceAll('<p>', '').replaceAll('</p>', '');
    }
    return summary;
};