import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentPage: 1,
            totalPages: 1
        };
    }

    componentDidMount() {
        // Fetch data from the API endpoint for the first page
        this.fetchData(this.state.currentPage);
    }

    fetchData = (page) => {
        const pageSize = 100; // Define the page size here
        const skip = (page - 1) * pageSize; // Calculate the skip value

        fetch(`http://localhost:8000/api/machinewise?page=${page}`)
            .then(response => response.json())
            .then(data => {
                const mappedData = data.data.map(item => ({
                    x: new Date(item.ts).getTime(),
                    y: item.machine_status === 0 ? Math.abs(item.vibration) : (item.machine_status === 1 ? item.vibration : null),
                    fillColor: item.machine_status === 1 ? "#FFFF00" : (item.machine_status === 0 ? "#FF0000" : "#00FF00")
                }));

                this.setState({
                    data: mappedData,
                    totalPages: Math.ceil(data.totalCount / pageSize), // Calculate total pages
                    currentPage: page
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    render() {
        const { data, currentPage, totalPages } = this.state;

        const options = {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '50%',
                    endingShape: 'flat'
                },
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                type: 'datetime',
            },
            yaxis: {
                labels: {
                    show: false // Hide y-axis labels
                }
            },
            fill: {
                colors: data.map(item => item.fillColor),
                type: 'solid',
            }
        };

        const series = [{
            name: 'Vibration',
            data: data.map(item => ({
                x: item.x,
                y: item.y
            }))
        }];

        return ( <
            div >
            <
            ReactApexChart options = { options }
            series = { series }
            type = "bar"
            height = { 350 }
            /> <
            div >
            <
            button onClick = {
                () => this.fetchData(currentPage - 1)
            }
            disabled = { currentPage === 1 } > Previous Page < /button> <
            span > Page { currentPage }
            of { totalPages } < /span> <
            button onClick = {
                () => this.fetchData(currentPage + 1)
            }
            disabled = { currentPage === totalPages } > Next Page < /button> < /
            div > <
            /div>
        );
    }
}

export default App;