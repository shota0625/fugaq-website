// フガク株式会社ウェブサイト - メインスクリプト

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    // 共通機能の初期化
    initializeCommonFeatures();
    
    // ページ固有の機能
    initializePageSpecificFeatures();
});

// 共通機能の初期化
function initializeCommonFeatures() {
    // スクロールインジケーター
    initScrollIndicator();
    
    // ハンバーガーメニュー
    initHamburgerMenu();
    
    // スムーススクロール
    initSmoothScroll();
    
    // アニメーション
    initScrollAnimations();
    
    // フォームバリデーション
    initFormValidation();
}

// スクロールインジケーター
function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-progress');
    if (!indicator) return;
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        indicator.style.width = scrolled + '%';
    });
}

// ハンバーガーメニュー
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // メニュー項目クリック時にメニューを閉じる
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // 外部クリック時にメニューを閉じる
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// スムーススクロール
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// スクロールアニメーション
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // アニメーション対象要素を監視
    document.querySelectorAll('.service-card, .feature-item, .stat-item, .news-item').forEach(el => {
        observer.observe(el);
    });
}

// ページ固有の機能初期化
function initializePageSpecificFeatures() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'contact':
            initContactForm();
            break;
        case 'news':
            initNewsFiltering();
            break;
        case 'services':
            initServiceInteractions();
            break;
        default:
            break;
    }
}

// 現在のページを取得
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('contact')) return 'contact';
    if (path.includes('news')) return 'news';
    if (path.includes('services')) return 'services';
    return 'home';
}

// お問い合わせフォーム
function initContactForm() {
    const form = document.getElementById('contactForm');
    const messageTextarea = document.getElementById('message');
    const messageCount = document.getElementById('messageCount');
    
    if (!form) return;
    
    // 文字数カウント
    if (messageTextarea && messageCount) {
        messageTextarea.addEventListener('input', function() {
            const count = this.value.length;
            messageCount.textContent = count;
            
            if (count > 1000) {
                messageCount.style.color = '#dc3545';
            } else {
                messageCount.style.color = '#6c757d';
            }
        });
    }
    
    // フォーム送信
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            showSubmitLoader();
            // ここで実際の送信処理を行う
            setTimeout(() => {
                hideSubmitLoader();
                showSuccessMessage();
            }, 2000);
        }
    });
}

// フォームバリデーション
function initFormValidation() {
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearError(field));
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // 必須チェック
    if (!value) {
        isValid = false;
        errorMessage = 'この項目は必須です。';
    }
    
    // 特定フィールドの詳細バリデーション
    switch(fieldName) {
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = '正しいメールアドレスを入力してください。';
            }
            break;
        case 'phone':
            if (value && !isValidPhone(value)) {
                isValid = false;
                errorMessage = '正しい電話番号を入力してください。';
            }
            break;
        case 'website':
            if (value && !isValidURL(value)) {
                isValid = false;
                errorMessage = '正しいURLを入力してください。';
            }
            break;
    }
    
    showError(field, isValid ? '' : errorMessage);
    return isValid;
}

function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isFormValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

function showError(field, message) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';
    }
    
    field.classList.toggle('error', !!message);
}

function clearError(field) {
    showError(field, '');
}

// バリデーション関数
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    return phoneRegex.test(phone);
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ニュースフィルタリング
function initNewsFiltering() {
    const categoryLinks = document.querySelectorAll('.category-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブ状態を更新
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterNews(category);
        });
    });
}

function filterNews(category) {
    const newsItems = document.querySelectorAll('.news-item, .upcoming-item');
    
    newsItems.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// サービスページのインタラクション
function initServiceInteractions() {
    // サービス詳細の展開・折りたたみ
    const serviceCards = document.querySelectorAll('.service-detail');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
}

// ローディング表示
function showSubmitLoader() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
        submitBtn.disabled = true;
    }
}

function hideSubmitLoader() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> お問い合わせを送信';
        submitBtn.disabled = false;
    }
}

// 成功メッセージ表示
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    if (form) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>お問い合わせを受け付けました</h3>
                <p>2営業日以内にご返信いたします。ありがとうございました。</p>
            </div>
        `;
        
        form.style.display = 'none';
        form.parentNode.insertBefore(successMessage, form);
    }
}

// ユーティリティ関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// パフォーマンス最適化
const debouncedScroll = debounce(() => {
    // スクロール処理
}, 10);

window.addEventListener('scroll', debouncedScroll);

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // 必要に応じてエラーレポートサービスに送信
});

// ServiceWorker登録（PWA対応）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// パフォーマンス監視
window.addEventListener('load', function() {
    // ページ読み込み時間を測定
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');
});