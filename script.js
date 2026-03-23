document.addEventListener('DOMContentLoaded', function () {
            
    // 1. Dark Mode Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });

    // 2. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Trigger only once
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
    
    // 3. Portfolio Projects Data
    const projects = [
        {
            title: "Sales Analysis Dashboard",
            img: "Screenshot 2024-12-07 163948.png",
            desc: "An interactive Power BI dashboard designed to provide a 360-degree view of sales operations. It tracks KPIs like total sales, profit margins, and sales growth.",
            skills: ["Power BI", "DAX", "Power Query"]
        },
        {
            title: "HR Analytics Dashboard",
            img: "Screenshot 2025-08-31 213552.png",
            desc: "A dynamic Power BI dashboard offering deep insights into workforce analytics. Visualizes critical HR metrics like employee turnover and recruitment funnels.",
            skills: ["Power BI", "HR Analytics", "Data Storytelling"]
        },
        {
            title: "Order & Inventory Analysis",
            img: "Screenshot 2025-01-02 234607.png",
            desc: "An integrated dashboard providing a real-time view of stock levels, order status, and supply chain movements to prevent stockouts.",
            skills: ["Power BI", "Supply Chain", "Predictive Analytics"]
        },
        {
            title: "Comprehensive Financial Analysis",
            img: "Screenshot 2025-04-03 230707.png",
            desc: "A sophisticated financial model built in Excel, featuring dynamic P&L, Balance Sheet, and Cash Flow statements leveraging Power Query.",
            skills: ["Advanced Excel", "Power Query", "Financial Modeling"]
        },
        {
            title: "Digital Marketing Campaign",
            img: "Screenshot 2025-05-01 155410.jpg",
            desc: "A data-driven dashboard evaluating digital marketing performance by integrating data from ad platforms to optimize ROI and CAC.",
            skills: ["Power BI", "Marketing Analytics", "ROI Analysis"]
        }
    ];

    // 4. Render Portfolio Cards
    const portfolioGrid = document.getElementById('portfolio-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const analysisResult = document.getElementById('analysis-result');
    const loader = document.getElementById('loader');

    projects.forEach(project => {
        const skillsTags = project.skills.map(skill => `<span>${skill}</span>`).join('');
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${project.img}" alt="${project.title}" class="card-img">
            </div>
            <div class="card-body">
                <h3 class="card-title">${project.title}</h3>
                <p class="card-desc">${project.desc}</p>
                <div class="card-skills">${skillsTags}</div>
            </div>
        `;

        const cardImg = card.querySelector('.card-img');
        cardImg.addEventListener('click', () => {
            lightbox.classList.add('visible');
            lightboxImg.src = cardImg.src;
            analysisResult.style.display = 'none'; // Hide result area initially
            analysisResult.innerHTML = ''; 
            analyzeBtn.disabled = false;
        });

        portfolioGrid.appendChild(card);
    });

    // 5. Lightbox & AI Analysis Logic
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('visible');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('visible');
        }
    });

    function mockApiCall(imageSrc) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let analysisText = "AI analysis is not available for this dashboard yet. Please check back later.";
                
                if (imageSrc.includes("163948.png")) { 
                    analysisText = "💡 **AI Insights:** This sales dashboard effectively tracks KPIs like total revenue and profit margin. Key insights indicate a strong performance in the 'Technology' category. \n\n🎯 **Recommendation:** Investigate the low-performing 'Office Supplies' sub-category to identify opportunities for growth.";
                } else if (imageSrc.includes("213552.png")) {
                    analysisText = "💡 **AI Insights:** The HR dashboard highlights a high employee turnover rate in the 'Sales' department. The male-to-female ratio is well-balanced. \n\n🎯 **Recommendation:** Conduct exit interviews for the sales department to understand the reasons for attrition and implement retention strategies.";
                } else if (imageSrc.includes("234607.png")) {
                    analysisText = "💡 **AI Insights:** This dashboard shows a clear correlation between order quantity and shipping costs. 'Standard Class' is the most used shipping mode. \n\n🎯 **Recommendation:** Explore bulk shipping discounts with carriers for high-volume products to reduce overall logistics expenses.";
                } else if (imageSrc.includes("230707.png")) {
                    analysisText = "💡 **AI Insights:** The Excel financial model demonstrates strong data integration using Power Query. The pivot tables effectively summarize monthly expenses. \n\n🎯 **Recommendation:** Implement conditional formatting to automatically highlight budget variances exceeding 10% for quicker identification of issues.";
                } else if (imageSrc.includes("155410.jpg")) { 
                    analysisText = "💡 **AI Insights:** This marketing dashboard reveals that the 'Facebook Ads' campaign has the highest Customer Acquisition Cost (CAC) but also the highest conversion rate. \n\n🎯 **Recommendation:** Optimize ad spend by reallocating a portion of the budget from lower-performing channels to Facebook, while A/B testing ad creatives to lower CAC.";
                }
                
                resolve(analysisText);
            }, 1500);
        });
    }

    analyzeBtn.addEventListener('click', async () => {
        analysisResult.innerHTML = '';
        analysisResult.style.display = 'none';
        loader.style.display = 'block';
        analyzeBtn.disabled = true;

        const analysisText = await mockApiCall(lightboxImg.src);

        loader.style.display = 'none';
        
        // Simple markdown parsing for bold text
        const formattedText = analysisText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        analysisResult.innerHTML = formattedText;
        analysisResult.style.display = 'block';
        analyzeBtn.disabled = false;
    });

});