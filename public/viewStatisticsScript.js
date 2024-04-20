document.addEventListener('DOMContentLoaded', function() {
    //fetch the list of items to populate the dropdown menu
    fetch('/api/getStorageComponentsItems')
        .then(response => response.json())
        .then(items => {
            const itemSelect = document.getElementById('itemSelect');
            
            //populate the dropdown menu
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.name;
                option.textContent = item.name;
                itemSelect.appendChild(option);
            });
            
            //fetch and display data for the first item
            fetchDataAndDisplayChart(items[0].name);
            
            //add event listener to update the chart when the selected item changes
            itemSelect.addEventListener('change', function() {
                const selectedItem = itemSelect.value;
                fetchDataAndDisplayChart(selectedItem);
            });
        })
        .catch(error => {
            console.error('Error fetching items:', error);
        });
    
    //function to fetch data and display the pie chart
    function fetchDataAndDisplayChart(itemName) {
        const url = `/api/getStorageComponentsStats/${encodeURIComponent(itemName)}`;

        //fetch data for the selected item from the server
        fetch(url)
            .then(response => response.json())
            .then(data => {
                //create or update the pie chart
                const ctx = document.getElementById('storageChart').getContext('2d');
                const chartData = {
                    labels: ['In Use', 'In Storage', 'Under Maintenance'],
                    datasets: [{
                        data: [data.inUse, data.inStorage, data.underMaintenance],
                        backgroundColor: ['#4caf50', '#2196f3', '#ff9800']
                    }]
                };

                //check if the chart already exists
                if (window.chartInstance) {
                    //update the chart data
                    window.chartInstance.data = chartData;
                    window.chartInstance.update();
                } else {
                    //create a new pie chart
                    window.chartInstance = new Chart(ctx, {
                        type: 'pie',
                        data: chartData,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: `Distribution of ${itemName}`
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
});
