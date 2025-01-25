const defaultItemImage = 'img/tvstatic.jpeg';

const buildTvItems = (result) => {
    const tvItemsElement = document.querySelector('.tv-items');
    tvItemsElement.innerHTML = '';
    for(tvItem of result) {
        addTvItemElement(tvItem, tvItemsElement);
    }
    setTvDetailsSize();
};

const buildTvDetails = (result) => {
    const itemDetailsBodyElement = document.querySelector('.item-details-body');
    itemDetailsBodyElement.innerHTML = '';
    document.querySelector('.item-details-title').textContent = result.name;
    createNewElement('img', 'item-details-image', itemDetailsBodyElement).setAttribute('src', `${result?.image?.original ?? defaultItemImage}`);
    const itemDetailsSummary = createNewElement('article', '', itemDetailsBodyElement);
    createNewElement('p', 'item-details-summary', itemDetailsSummary).innerHTML = `${formatSummary(result?.summary)}`;
    const itemDetailsData = createNewElement('p', 'item-details-data', itemDetailsSummary);
    const keysToPrint = {
        type: 'Tipo',
        language: 'Idioma original',
        genres: 'Genero(s)',
        status: 'Estatus',
        premiered: 'Estrenado',
        ended: {
            label: 'Terminado',
            defaultValue: 'Aun no termina'
        },
        runtime: {
            label: 'Episodios',
            defaultValue: '0'
        },
        rating: {
            label: 'Calificacion',
            valueFrom: 'average'
        },        
    };
    for(key in result) {
        const keyToPrint = keysToPrint[key];
        if (keyToPrint) {
            if (typeof keyToPrint === 'string') {
                createNewElement('span', 'item-details-text', itemDetailsData, `${keyToPrint} : ${result[key]}`);
            } else if (typeof keyToPrint === 'object') {
                const keyTextContent = `${keyToPrint.label} : ${result[key] && typeof result[key] === 'object' ? result[key][keyToPrint.valueFrom] : result[key] ?? keyToPrint.defaultValue}`;
                createNewElement('span', 'item-details-text', itemDetailsData, keyTextContent);
            }
        }
    }
};

const addTvItemElement = (tvItemObject, itemsContainer) => {
    const startIconSrc = 'img/start.svg';
    const newTvItemElement = createNewElement('article', 'tv-item', itemsContainer);
    newTvItemElement.setAttribute('data-id', tvItemObject.show.id);
    const newTvItemSummary = createNewElement('div', 'tv-item-summary', newTvItemElement);
    newTvItemSummary.innerHTML = `<p>${formatSummary(tvItemObject?.show?.summary)}</p>`;
    const newTvItemSummaryDetails = createNewElement('ul', '', newTvItemSummary);
    const tvItemSumaryDetails = getTvSummaryDetails(tvItem);
    for (detail of tvItemSumaryDetails) {
        createNewElement('li', '', newTvItemSummaryDetails, detail);
    }
    addEventListener('click', newTvItemElement, () => {
        document.querySelectorAll('.tv-item-summary--shown').forEach(c => {
            if (newTvItemSummary != c) {
                c.classList.remove('tv-item-summary--shown');
            }
        });
        newTvItemSummary.style.height = `${newTvItemElement.offsetHeight}px`;
        newTvItemSummary.classList.toggle('tv-item-summary--shown');
    });
    const newTvItemImgElement = createNewElement('img', 'tv-item-image', newTvItemElement);
    const tvItemImage = tvItemObject?.show?.image?.medium ?? defaultItemImage;
    newTvItemImgElement.setAttribute('src', tvItemImage);
    createNewElement('h2', 'tv-item-title', newTvItemElement, tvItemObject.show.name);
    const newTvItemDataElement = createNewElement('p', 'tv-item-data', newTvItemElement);
    const newTvItemDataIconElement = createNewElement('i', '', newTvItemDataElement);
    const newTvItemDataIconImageElement = createNewElement('img', '', newTvItemDataIconElement);
    newTvItemDataIconImageElement.setAttribute('src', startIconSrc);
    newTvItemDataIconImageElement.setAttribute('alt', 'Puntuaje');
    const tvItemRate = (tvItem.score * 100).toFixed(2) < 100 ? (tvItem.score * 100).toFixed(2) : 100;
    createNewElement('span', '', newTvItemDataElement, tvItemRate);
    const newTvItemLinkElement = createNewElement('button', 'tv-item-link', newTvItemSummary, 'Ver mas detalles');
    addEventListener('click', newTvItemLinkElement, () => {
        const showId = newTvItemElement.getAttribute('data-id');
        getData(`shows/${showId}?embed=cast`)
        .then(result => {
            buildTvDetails(result);
        }).catch(error => {
            console.error('Ocurrio un error en la consulta de la API', error);
        });
        document.querySelector('.item-details').classList.toggle('item-details--shown');
    });

};

const getTvSummaryDetails = (tvItemObject) => {
    let tvItemSummaryDetails = [];
    if (tvItemObject?.show?.language) {
        tvItemSummaryDetails.push(tvItemObject.show.language);
    }
    if (tvItemObject?.show?.genres) {
        tvItemSummaryDetails = tvItemSummaryDetails.concat(tvItemObject.show.genres);
    }
    if (tvItemObject?.show?.type) {
        tvItemSummaryDetails.push(tvItemObject.show.type);
    }
    if (tvItemObject?.show?.status) {
        tvItemSummaryDetails.push(tvItemObject.show.status);
    }    
    if (tvItemObject?.show?.webChannel?.name) {
        tvItemSummaryDetails.push(tvItemObject.show.webChannel.name);
    }
    return tvItemSummaryDetails;
};

const getTvResults = (query) => {
    getData(`search/shows?q=${query}`)
    .then(result => {
        buildTvItems(result);
    }).catch(error => {
        console.error('Ocurrio un error en la consulta de la API', error);
    });
};

const setTvDetailsSize = () => {
    document.querySelector('.item-details').style.height = `${window.innerHeight}px`;
    document.querySelector('.item-details').style.width = `${window.innerWidth}px`;
};

document.querySelector('.menu').addEventListener('click', (e) => {
    document.querySelector('.navmenu').classList.toggle('navmenu--shown');
});

document.getElementById('mainsearch').addEventListener('keypress', (e) => {
    if (e.key.toLocaleLowerCase() === 'enter') {
        getTvResults(e.target.value);
    }
});

document.querySelector('.close-details').addEventListener('click', () => {
    document.querySelector('.item-details').classList.toggle('item-details--shown');
});

window.addEventListener('keydown', (e) => {
    if (e.defaultPrevented) {
        return;
    } else if (e.key.toLocaleLowerCase() === 'escape') {
        document.querySelector('.item-details').classList.remove('item-details--shown');
    }
});

window.addEventListener('resize', setTvDetailsSize);

getTvResults('a');