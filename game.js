$(document).ready(function() {
    let gameNumber = 1;
    let timer;
    let timeLeft = 60;
    let currentSequence = 1;
    let gameStats = [];
    let gameStartTime;

    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6',
        '#F1948A', '#85929E', '#F39C12', '#8E44AD', '#3498DB',
        '#E74C3C', '#1ABC9C', '#2ECC71', '#E67E22', '#9B59B6',
        '#34495E', '#16A085', '#27AE60', '#2980B9', '#D35400'
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function generateBoard() {
        const numbers = shuffle([...Array(25).keys()].map(i => i + 1));
        const shuffledColors = shuffle([...colors]);

        $('#gameBoard').empty();

        for (let i = 0; i < 25; i++) {
            const $cell = $('<div>')
                .addClass('cell')
                .attr('data-number', numbers[i])
                .css({
                    'color': shuffledColors[i],
                    'font-size': Math.floor(Math.random() * 30 + 30) + 'px'
                })
                .text(numbers[i]);

            $cell.on('click', handleCellClick);
            $('#gameBoard').append($cell);
        }
    }

    function handleCellClick() {
        const $cell = $(this);
        const clickedNumber = parseInt($cell.attr('data-number'));

        if ($cell.hasClass('clicked')) {
            return;
        }

        if (clickedNumber === currentSequence) {
            $cell.addClass('clicked correct');
            currentSequence++;

            if (currentSequence > 25) {
                endGame(true);
            }
        } else {
            $cell.addClass('clicked wrong');
            setTimeout(() => {
                alert('Не вірна цифра! Спробуйте ще раз. Потрібно натиснути: ' + currentSequence);
                $cell.removeClass('clicked wrong');
            }, 500);
        }
    }

    function startTimer() {
        gameStartTime = Date.now();
        updateTimerDisplay();

        timer = setInterval(function() {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                endGame(false);
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        $('#timer').text('Час: ' + timeLeft + ' с.');
        $('#timeLeft').text('Залишилось: ' + timeLeft);
    }

    function endGame(won) {
        clearInterval(timer);
        $('.cell').off('click');

        const finalTime = 60 - timeLeft;

        gameStats.push({
            name: 'Гра ' + gameNumber,
            time: finalTime + ' с.'
        });

        updateStatsTable();
        gameNumber++;

        if (won) {
            $('#finalTime').text(finalTime);
            $('.game-screen').fadeOut(300, function() {
                $('.win-screen').fadeIn(300);
            });
        } else {
            alert('Час вийшов! Спробуйте ще раз.');
            resetGame();
        }
    }

    function updateStatsTable() {
        const $tbody = $('#statsBody');
        $tbody.empty();

        let bestTime = Math.min(...gameStats.map(stat => parseInt(stat.time)));

        gameStats.forEach(function(stat) {
            const $row = $('<tr>');
            if (parseInt(stat.time) === bestTime) {
                $row.addClass('best-score');
            }
            $row.append($('<td>').text(stat.name));
            $row.append($('<td>').text(stat.time));
            $tbody.append($row);
        });
    }

    function resetGame() {
        clearInterval(timer);
        timeLeft = 60;
        currentSequence = 1;
        generateBoard();
        startTimer();
    }

    $('#startButton').on('click', function() {
        $('.start-screen').fadeOut(300, function() {
            $('.game-screen').fadeIn(300);
            generateBoard();
            startTimer();
        });
    });

    $('#restartButton').on('click', function() {
        if (confirm('Ви впевнені, що хочете почати гру заново?')) {
            resetGame();
        }
    });

    $('#playAgainButton').on('click', function() {
        $('.win-screen').fadeOut(300, function() {
            $('.game-screen').fadeIn(300);
            resetGame();
        });
    });
});
