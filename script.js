     function updateTicker() {
            const tickerItems = document.querySelectorAll('.ticker-item');
            tickerItems.forEach(item => {
                const parts = item.textContent.split(':');
                if (parts.length === 2) {
                    const symbol = parts[0].trim();
                    let value = parseFloat(parts[1]);
                    const change = (Math.random() - 0.5) * 0.2;
                    value += change;
                    const formattedChange = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
                    
                    if (['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/BRL'].includes(symbol)) {
                        item.innerHTML = `${symbol}: ${value.toFixed(4)} (<span class="percentage ${change >= 0 ? 'positive' : 'negative'}">${formattedChange}</span>)`;
                    } else {
                        item.innerHTML = `${symbol}: ${value.toFixed(0)} (<span class="percentage ${change >= 0 ? 'positive' : 'negative'}">${formattedChange}</span>)`;
                    }
                }
            });
        }

        setInterval(updateTicker, 5000);
        updateTicker();

        document.getElementById('calculate-btn').addEventListener('click', function() {
            const investment = parseFloat(document.getElementById('investment').value);
            const days = parseInt(document.getElementById('days').value);
            
            if (isNaN(investment) || isNaN(days) || investment < 500 || days < 1) {
                alert('Por favor, insira valores válidos. O investimento mínimo é de R$ 500.');
                return;
            }
            
            
            const dailyReturn = 0.80 / 100;
            const totalReturn = investment * Math.pow(1 + dailyReturn, days);
            const profit = totalReturn - investment;
            
            const resultElement = document.getElementById('result');
            resultElement.innerHTML = `
                <p>Investimento Inicial: R$ ${investment.toFixed(2)}</p>
                <p>Retorno Estimado: R$ ${totalReturn.toFixed(2)}</p>
                <p>Lucro: R$ ${profit.toFixed(2)}</p>
                <p>Rendimento: ${((profit / investment) * 100).toFixed(2)}%</p>
            `;
        });

        document.addEventListener('DOMContentLoaded', function() {
            const svg = document.querySelector('.performance-chart svg');
            const valueDisplay = document.getElementById('value-display');
            const performanceLine = document.getElementById('performance-line');
            const dataPoints = svg.querySelectorAll('circle');

            function showValue(x, y, value) {
                valueDisplay.textContent = `R$ ${value.toLocaleString()}`;
                valueDisplay.setAttribute('x', x);
                valueDisplay.setAttribute('y', y - 15);
                valueDisplay.style.display = 'block';
            }

            function hideValue() {
                valueDisplay.style.display = 'none';
            }

            function activateDataPoint(point) {
                dataPoints.forEach(p => p.classList.remove('active'));
                point.classList.add('active');
            }

            svg.addEventListener('click', function(e) {
                const rect = svg.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Check if clicked on a data point
                const clickedPoint = Array.from(dataPoints).find(point => {
                    const cx = parseFloat(point.getAttribute('cx'));
                    const cy = parseFloat(point.getAttribute('cy'));
                    return Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) < 10;
                });

                if (clickedPoint) {
                    const value = clickedPoint.getAttribute('data-value');
                    showValue(clickedPoint.getAttribute('cx'), clickedPoint.getAttribute('cy'), value);
                    activateDataPoint(clickedPoint);
                } else {
                    // If clicked on the line, find the closest point
                    const closestPoint = Array.from(dataPoints).reduce((closest, point) => {
                        const cx = parseFloat(point.getAttribute('cx'));
                        const cy = parseFloat(point.getAttribute('cy'));
                        const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                        return distance < closest.distance ? { point, distance } : closest;
                    }, { point: null, distance: Infinity }).point;

                    if (closestPoint) {
                        const value = closestPoint.getAttribute('data-value');
                        showValue(closestPoint.getAttribute('cx'), closestPoint.getAttribute('cy'), value);
                        activateDataPoint(closestPoint);
                    }
                }
            });

            svg.addEventListener('mouseleave', hideValue);
        });
    