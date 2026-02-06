  document.addEventListener("DOMContentLoaded", function () {
            const cake = document.querySelector(".cake");
            let candles = [];
            let audioContext;
            let analyser;
            let microphone;

            function addCandle(left, top) {
                const candle = document.createElement("div");
                candle.className = "candle";
                candle.style.left = (left - 7) + "px";
                candle.style.top = (top - 10) + "px";

                const flame = document.createElement("div");
                flame.className = "flame";
                candle.appendChild(flame);

                cake.appendChild(candle);
                candles.push(candle);

                // Add sparkle effect
                createSparkles(left, top);
            }

            function createSparkles(x, y) {
                for (let i = 0; i < 5; i++) {
                    const sparkle = document.createElement("div");
                    sparkle.innerHTML = "✨";
                    sparkle.style.position = "absolute";
                    sparkle.style.left = x + (Math.random() - 0.5) * 40 + "px";
                    sparkle.style.top = y + (Math.random() - 0.5) * 40 + "px";
                    sparkle.style.pointerEvents = "none";
                    sparkle.style.fontSize = "12px";
                    sparkle.style.animation = "floatUp 2s ease-out forwards";
                    cake.appendChild(sparkle);

                    setTimeout(() => sparkle.remove(), 2000);
                }
            }
            const cakeTop = document.querySelector(".icing");

            cakeTop.addEventListener("click", function (event) {
                const rect = cakeTop.getBoundingClientRect();
                const left = event.clientX - rect.left;
                const top = event.clientY - rect.top;
                addCandle(left, top);

                // Add click effect
                createFloatingHeart(event.clientX, event.clientY);
            });

            function createFloatingHeart(x, y) {
                const heart = document.createElement("div");
                heart.className = "floating-heart";
                heart.innerHTML = "💖";
                heart.style.left = x + "px";
                heart.style.top = y + "px";
                document.body.appendChild(heart);

                setTimeout(() => heart.remove(), 4000);
            }

            function isBlowing() {
                if (!analyser) return false;
                
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(dataArray);

                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                let average = sum / bufferLength;

                return average > 50;
            }

            function blowOutCandles() {
                let blownOut = 0;
                const ageFlame = document.querySelector(".age-flame");
                if (isBlowing() && ageFlame) {
                    ageFlame.style.display = "none";
                }
                if (candles.length > 0 && candles.some(candle => !candle.classList.contains("out"))) {
                    if (isBlowing()) {
                        candles.forEach(candle => {
                            if (!candle.classList.contains("out") && Math.random() > 0.5) {
                                candle.classList.add("out");
                                blownOut++;
                            }
                        });
                    }

                    if (candles.every(candle => candle.classList.contains("out"))) {
                        setTimeout(function() {
                            triggerConfetti();
                            endlessConfetti();
                        }, 200);
                    }
                }
            }

            // Microphone setup
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices
                    .getUserMedia({ audio: true })
                    .then(function (stream) {
                        audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        analyser = audioContext.createAnalyser();
                        microphone = audioContext.createMediaStreamSource(stream);
                        microphone.connect(analyser);
                        analyser.fftSize = 256;
                        setInterval(blowOutCandles, 170);
                    })
                    .catch(function (err) {
                        console.log("Unable to access microphone: " + err);
                    });
            }

            function triggerConfetti() {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
                });
            }

            function endlessConfetti() {
                const confettiInterval = setInterval(function() {
                    confetti({
                        particleCount: 100,
                        spread: 90,
                        origin: { y: 0 },
                        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
                    });
                }, 1500);

                // Stop endless confetti after 10 seconds
                setTimeout(() => clearInterval(confettiInterval), 10000);
            }

            // Letter functionality
            const openLetterBtn = document.getElementById("openLetter");
            const letter = document.getElementById("letter");

            openLetterBtn.addEventListener("click", function () {
                letter.classList.toggle("open");
                const isOpen = letter.classList.contains("open");
                letter.setAttribute("aria-hidden", !isOpen);

                if (isOpen) {
                    letter.focus();
                    // Create hearts around the button
                    for (let i = 0; i < 6; i++) {
                        setTimeout(() => {
                            const rect = openLetterBtn.getBoundingClientRect();
                            createFloatingHeart(
                                rect.left + rect.width/2 + (Math.random() - 0.5) * 100,
                                rect.top + rect.height/2 + (Math.random() - 0.5) * 100
                            );
                        }, i * 200);
                    }
                }
            });

            // Close letter when clicking outside
            letter.addEventListener("click", function(e) {
                if (e.target === letter) {
                    letter.classList.remove("open");
                    letter.setAttribute("aria-hidden", true);
                }
            });

            // Random floating hearts
            setInterval(() => {
                if (Math.random() > 0.7) {
                    createFloatingHeart(
                        Math.random() * window.innerWidth,
                        window.innerHeight + 50
                    );
                }
            }, 3000);
        });