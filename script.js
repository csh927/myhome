document.addEventListener('DOMContentLoaded', () => {
    // Hero Animations
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroBadge = document.getElementById('hero-badge');

    // Typing Effect for Hero Subtitle
    const typingText = "데이터와 논리로 장비의 가동률을 극대화하는\n준비된 Physical AI 엔지니어";
    let i = 0;
    const speed = 50;
    
    function typeWriter() {
        if (i < typingText.length) {
            heroSubtitle.innerHTML += typingText.charAt(i) === '\n' ? '<br>' : typingText.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }

    setTimeout(() => {
        if (heroTitle) {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }
    }, 400);

    setTimeout(() => {
        if (heroSubtitle) {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
            heroSubtitle.innerHTML = ""; // Clear for typing
            typeWriter();
        }
    }, 700);

    setTimeout(() => {
        if (heroBadge) {
            heroBadge.style.opacity = '1';
            heroBadge.style.transform = 'translateY(0)';
        }
    }, 1000);

    // Reveal on Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Stagger children if grid
                const children = entry.target.querySelectorAll('.skill-card');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.15}s`;
                    child.classList.add('active');
                });
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // Header Scroll Effect
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Parallax Effect on Background Blobs
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
        
        const blob1 = document.getElementById('blob1');
        const blob2 = document.getElementById('blob2');
        
        if (blob1) blob1.style.transform = `translate(${moveX}px, ${moveY}px)`;
        if (blob2) blob2.style.transform = `translate(${-moveX}px, ${moveY}px)`;
    });

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            alert(`${name}님, 메시지가 성공적으로 전송되었습니다!\n이메일(${email})로 곧 연락드리겠습니다.`);
            contactForm.reset();
        });
    }

    // --- Bulletin Board Logic ---
    const boardForm = document.getElementById('board-form');
    const boardList = document.getElementById('board-list');
    const boardFormContainer = document.getElementById('board-form-container');
    const boardListContainer = document.getElementById('board-list-container');
    const writeBtn = document.getElementById('write-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const postIdInput = document.getElementById('post-id');
    const formSubmitBtn = document.getElementById('form-submit-btn');

    function showForm(postId = null) {
        boardListContainer.style.display = 'none';
        boardFormContainer.style.display = 'block';
        if (postId !== null) {
            const posts = JSON.parse(localStorage.getItem('amk_board_posts') || '[]');
            const post = posts.find(p => p.id === postId);
            if (post) {
                postIdInput.value = post.id;
                document.getElementById('board-name').value = post.name;
                document.getElementById('board-email').value = post.email;
                document.getElementById('board-content').value = post.content;
                formSubmitBtn.innerText = '수정 완료';
            }
        } else {
            boardForm.reset();
            postIdInput.value = '';
            formSubmitBtn.innerText = '게시글 등록';
        }
    }

    function showList() {
        boardFormContainer.style.display = 'none';
        boardListContainer.style.display = 'block';
        loadPosts();
    }

    writeBtn.addEventListener('click', () => showForm());
    cancelBtn.addEventListener('click', () => showList());

    // Load posts from localStorage
    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('amk_board_posts') || '[]');
        boardList.innerHTML = '';
        
        if (posts.length === 0) {
            boardList.innerHTML = '<p style="text-align: center; color: #b1b1b1; padding: 3rem;">등록된 게시글이 없습니다. 첫 번째 글을 남겨보세요!</p>';
            return;
        }

        posts.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            postCard.innerHTML = `
                <div class="post-header">
                    <span class="post-author">${post.name}</span>
                    <span class="post-date">${post.date}</span>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <button class="edit-btn" onclick="editPost('${post.id}')"><i class="fa-solid fa-edit"></i> 수정</button>
                    <button class="delete-btn" onclick="deletePost('${post.id}')"><i class="fa-solid fa-trash"></i> 삭제</button>
                </div>
            `;
            boardList.appendChild(postCard);
        });
    }

    window.editPost = (id) => showForm(id);

    window.deletePost = (id) => {
        if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
            let posts = JSON.parse(localStorage.getItem('amk_board_posts') || '[]');
            posts = posts.filter(p => p.id !== id);
            localStorage.setItem('amk_board_posts', JSON.stringify(posts));
            loadPosts();
        }
    };

    if (boardForm) {
        boardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = postIdInput.value || Date.now().toString();
            const name = document.getElementById('board-name').value;
            const email = document.getElementById('board-email').value;
            const content = document.getElementById('board-content').value;
            const date = new Date().toLocaleString('ko-KR');

            let posts = JSON.parse(localStorage.getItem('amk_board_posts') || '[]');
            
            if (postIdInput.value) {
                // Update existing
                const index = posts.findIndex(p => p.id === id);
                if (index !== -1) {
                    posts[index] = { ...posts[index], name, email, content, date: date + ' (수정됨)' };
                }
            } else {
                // Add new
                posts.push({ id, name, email, content, date });
            }

            localStorage.setItem('amk_board_posts', JSON.stringify(posts));
            alert(postIdInput.value ? '게시글이 수정되었습니다.' : '게시글이 등록되었습니다.');
            showList();
        });
    }

    loadPosts();
});

// TAR Content Data
const tarData = {
    plc: {
        title: "Electrical & PLC Physical Recovery",
        trouble: "장비 메인 전력 회로의 노이즈로 인한 PLC 입력 신호 왜곡 및 시퀀스 중단 발생.",
        action: "전기 이론 지식을 활용해 오실로스코프로 노이즈 측정 후 노이즈 필터 설치 및 시퀀스 재작성.",
        result: "장비 안정성 40% 향상. 비정상 종료 데이터 기록 자동화 시스템 구축 기여."
    },
    web: {
        title: "HMI Web Dashboard System",
        trouble: "현장 엔지니어가 물리적 콘솔 앞에서만 장비 상태를 확인해야 하는 공간적 제약.",
        action: "웹프로그래밍 역량을 발휘해 실시간 센서 데이터를 가독성 높은 차트로 출력하는 반응형 웹 HMI 설계.",
        result: "언제 어디서나 장비 모니터링 가능. 트러블 발생 시 초동 대처 시간 10분 단축."
    },
    csharp: {
        title: "C# High-Precision Automation",
        trouble: "연산 오차 누적으로 인한 반도체 미세 공정 좌표값 드리프트(Drift) 현상.",
        action: "64비트 연산 체계 도입 및 정밀 물리 엔진 적용 라이브러리로 전면 개편.",
        result: "좌표 오차를 0.001mm 이내로 상시 유지하여 공정 신뢰성 비약적 상승."
    },
    ai: {
        title: "AI-Powered PdM Architecture",
        trouble: "명확한 고장 원인이 밝혀지지 않은 부품들의 잦은 고장으로 인한 생산성 저하.",
        action: "인공지능 개론 지식을 응용해 6개월 간의 로 데이터를 전처리하고 LSTM 기반 고장 시점 예측 모델 학습.",
        result: "고장 사전 인지율 92% 달성. 예방 정비 스케줄 최적화로 유지 비용 15% 절감."
    },
    design: {
        title: "TRIZ Root Cause Engineering",
        trouble: "장비 내부 기구물의 간섭으로 인한 공정 고장 발생 및 반복적 이슈.",
        action: "창의적 공학설계 기법(TRIZ)의 물리적 모순 원리를 적용하여 장비 구조적 개선안 제안 및 도면 반영.",
        result: "구조적 결함 원천 해결. MTBF(평균 무고장 시간) 25.5% 향상 기여."
    }
};

function openModal(key) {
    const data = tarData[key];
    const titleEl = document.getElementById('modalTitle');
    const troubleEl = document.getElementById('tarTrouble');
    const actionEl = document.getElementById('tarAction');
    const resultEl = document.getElementById('tarResult');

    if (titleEl) titleEl.innerText = data.title;
    if (troubleEl) troubleEl.innerText = data.trouble;
    if (actionEl) actionEl.innerText = data.action;
    if (resultEl) resultEl.innerText = data.result;
    
    const modal = document.getElementById('tarModal');
    if (modal) modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('tarModal');
    if (modal) modal.style.display = 'none';
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('tarModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
