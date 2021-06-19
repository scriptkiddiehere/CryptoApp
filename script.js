async function Crypto(){
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false')
    const data = await response.json();
    if(data.length>0){
        var temp = "";
        data.forEach(e => {
                temp +="<tr>";
                temp +="<td>"+`<img src = "${e.image}" alt="${e.id}" class="img"/>`+"</td>"
                temp +="<td>"+e.market_cap_rank+"</td>"
                temp +="<td style='cursor: pointer;' id='name' onclick='showHide()' class='crname'>"+e.id+"</td>"
                temp +="<td>"+e.symbol+"</td>"
                temp +="<td>"+"₹"+e.current_price.toLocaleString('en-IN')+"</td>"
                temp +="<td>"+"₹"+e.high_24h.toLocaleString('en-IN')+"</td>"
                temp +="<td>"+"₹"+e.low_24h.toLocaleString('en-IN')+"</td>"
                {e.price_change_percentage_24h<0 ? (
                    temp +="<td class='negative'>"+e.price_change_percentage_24h.toFixed(2)+"%"+"</td>"
                ) : (
                    temp +="<td class='positive'>"+e.price_change_percentage_24h.toFixed(2)+"%"+"</td>"
                )}
                
                temp +="<td>"+"₹"+e.market_cap.toLocaleString('en-IN')+"</td>"
                temp +="<td>"+"₹"+e.total_volume.toLocaleString('en-IN')+"</td></tr>"
        });
        document.getElementById("data").innerHTML = temp;
    }
}
Crypto();

const search = () => {
    let filter = document.getElementById('search').value.toUpperCase();
    let res = document.getElementById('data');
    let tr = res.getElementsByTagName('tr');
    for(var i=0; i<tr.length; i++){
        let td = tr[i].getElementsByTagName('td')[2];
        if(td){
            let value = td.textContent || td.innerHTML;
            if(value.toUpperCase().indexOf(filter) > -1){
                tr[i].style.display = "";
            }else{
                tr[i].style.display = "none";
            }
        }
    }
}

var a;
function showHide(){
    if(a==1){
        document.getElementById("content").style.display="inline";
        document.getElementById("coinContainer").style.display="none";
        document.getElementById("graph").style.display="none";
        return a = 0;
    }
    else{
        document.getElementById("content").style.display="none";
        document.getElementById("coinContainer").style.display="inline";
        document.getElementById("graph").style.display="inline";
        return a = 1;
    }
}


(function () {
    if (window.addEventListener) {
        window.addEventListener('load', run, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', run);
    }

    function run() {
        var t = document.getElementById('myTable');
        t.onclick = function (event) {
            event = event;
            var target = event.target;
            while (target && target.nodeName != 'TR') { 
                target = target.parentElement;
            }
            var cells = target.cells;  
            if (!cells.length || target.parentNode.nodeName == 'THEAD') {
                return;
            }
            var f1 = document.getElementById('name');
            f1.value = cells[2].innerHTML;
            id = f1.value.toLowerCase();
            async function coin(){
                const response = await fetch('https://api.coingecko.com/api/v3/coins/'+`${id}`)
                const data = await response.json();
                var head = data.name.toUpperCase();
                var img = `<img src = "${data.image.large}" alt="${data.id}" class="coinImage"/>`
                var temp = `<tr>
                <td>${data.symbol}</td>
                <td>₹${data.market_data.current_price.inr.toLocaleString('en-IN')}</td>
                <td class="positive">₹${data.market_data.high_24h.inr.toLocaleString('en-IN')}</td>
                <td class="negative">₹${data.market_data.low_24h.inr.toLocaleString('en-IN')}</td>
                <td>${data.market_data.price_change_percentage_24h.toFixed(2)}%</td>
                <td>${data.market_data.price_change_percentage_7d.toFixed(2)}%</td>
                <td>${data.market_data.price_change_percentage_14d.toFixed(2)}%</td>
                <td>${data.market_data.price_change_percentage_30d.toFixed(2)}%</td></tr>`
                var temp2 = data.description.en;
                var desc = $('<div>').html(temp2).text();
                document.getElementById("coinImage").innerHTML = img;
                document.getElementById("head").innerHTML = head;
                document.getElementById("coindata").innerHTML = temp;
                document.getElementById("coindetail").innerHTML = desc;
            }
            coin();
            
            async function chart(){
                const response = await fetch('https://api.coingecko.com/api/v3/coins/'+`${id}`+'/ohlc?vs_currency=inr&days=30')
                const data = await response.json();
                const formatData = (data) => {
                    return data.map((el) => {
                        return {
                            time: el[0]/1000,
                            open: el[1],
                            high: el[2],
                            low: el[3],
                            close: el[4],
                        }
                    })
                }
                price = formatData(data)
                var chartElement = document.getElementById('chart');
                var chart = LightweightCharts.createChart(chartElement, {   
                    width: 600,
                    height: 300,
                        layout: {
                            backgroundColor: '#000000',
                            textColor: 'rgba(255, 255, 255, 0.9)',
                        },
                        grid: {
                            vertLines: {
                                color: 'rgba(197, 203, 206, 0.5)',
                            },
                            horzLines: {
                                color: 'rgba(197, 203, 206, 0.5)',
                            },
                        },
                        crosshair: {
                            mode: LightweightCharts.CrosshairMode.Normal,
                        },
                        rightPriceScale: {
                            borderColor: 'rgba(197, 203, 206, 0.8)',
                        },
                        timeScale: {
                            borderColor: 'rgba(197, 203, 206, 0.8)',
                        },
                    });

                    var candleSeries = chart.addCandlestickSeries({
                    upColor: 'rgba(255, 144, 0, 1)',
                    downColor: '#000',
                    borderDownColor: 'rgba(255, 144, 0, 1)',
                    borderUpColor: 'rgba(255, 144, 0, 1)',
                    wickDownColor: 'rgba(255, 144, 0, 1)',
                    wickUpColor: 'rgba(255, 144, 0, 1)',
                    });
              
                candleSeries.setData(price);
            }
            chart();
        };
    }
})();