/* =========================================================
   مؤسسة هديل أحمد بله — سكريبت مشترك
   (نظام الجسيمات + تأثير الظهور عند التمرير)
   ========================================================= */
(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. خلفية فقاعات أعماق المحيط ---------- */
    var canvas = document.getElementById('magicCanvas');

    if (canvas && !reduceMotion) {
        var ctx = canvas.getContext('2d');
        var particlesArray = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        Particle.prototype.update = function () {
            this.y -= this.speedY;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        };
        Particle.prototype.draw = function () {
            ctx.fillStyle = 'rgba(0, 229, 255, ' + this.opacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        };

        function initParticles() {
            particlesArray = [];
            var count = window.innerWidth < 600 ? 80 : 150;
            for (var i = 0; i < count; i++) particlesArray.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', function () {
            resizeCanvas();
            initParticles();
        });

        resizeCanvas();
        initParticles();
        animateParticles();
    } else if (canvas) {
        canvas.style.display = 'none';
    }

    /* ---------- 2. تأثير الظهور عند التمرير ---------- */
    function activateReveals(list) {
        list.forEach(function (el) { el.classList.add('active'); });
    }

    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        if (reduceMotion) {
            activateReveals(Array.prototype.slice.call(reveals));
        } else if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });
            reveals.forEach(function (el) { io.observe(el); });
        } else {
            activateReveals(Array.prototype.slice.call(reveals));
        }
    }

    /* إتاحة IntersectionObserver لمحتوى يُضاف لاحقاً ديناميكياً (مثل بطاقات الأخبار) */
    window.observeReveal = function (el) {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            el.classList.add('active');
            return;
        }
        var io2 = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    io2.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        io2.observe(el);
    };
})();
