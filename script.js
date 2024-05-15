// solicitação viacep 
async function buscarCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar informações de CEP:', error);
        return null;
    }
}

// solicitação openmeteo
async function buscarPrevisaoTempo(latitude, longitude) {
    try {
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
        const data = await response.json();
        console.log('Resposta da API OpenMeteo:', data);

        if (data.hourly && data.hourly.temperature_2m && data.hourly.temperature_2m.length > 0) {
            const temperaturaAtual = data.hourly.temperature_2m[0];
            
            document.querySelector('.tempo-resultado p').textContent = `Previsão de tempo de acordo com a região: ${temperaturaAtual}°C`;

            return temperaturaAtual;
        } else {
            throw new Error('Dados de temperatura não encontrados');
        }
    } catch (error) {
        console.error('Erro ao buscar previsão do tempo:', error);
        document.querySelector('.tempo-resultado p').textContent = 'Não foi possível obter a previsão do tempo.';
        return null;
    }
}

document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const cep = document.getElementById('cep').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    const cepSemHifen = cep.replace('-', '');

    if (cepSemHifen.length !== 8 || isNaN(cepSemHifen)) {
        alert('CEP inválido. Formato esperado: 00000000.');
        return;
    }

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        alert('Latitude inválida. O valor deve estar entre -90 e 90.');
        return;
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        alert('Longitude inválida. O valor deve estar entre -180 e 180.');
        return;
    }

    const endereco = await buscarCEP(cepSemHifen);

    if (endereco) {
        document.querySelectorAll('.cep-resultado p')[0].textContent = endereco.logradouro || 'N/A';
        document.querySelectorAll('.cep-resultado p')[1].textContent = endereco.bairro || 'N/A';
        document.querySelectorAll('.cep-resultado p')[2].textContent = `${endereco.localidade}/${endereco.uf}` || 'N/A';
    }

    const previsaoTempo = await buscarPrevisaoTempo(latitude, longitude);
});
