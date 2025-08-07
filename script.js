document.addEventListener('DOMContentLoaded', function() {
    // 颜色方案定义
    const colorSchemes = {
        blue: { left: '#555555', right: '#007bff' },
        purple: { left: '#555555', right: '#a649ad' },
        green: { left: '#555555', right: '#28a745' },
        orange: { left: '#555555', right: '#fd7e14' },
        pink: { left: '#555555', right: '#e83e8c' },
        cyan: { left: '#555555', right: '#17a2b8' },
        yellow: { left: '#555555', right: '#ffc107' },
        red: { left: '#555555', right: '#dc3545' },
        indigo: { left: '#555555', right: '#6610f2' },
        grayblue: { left: '#eeeeee', right: '#007bff' },
        graypurple: { left: '#eeeeee', right: '#a649ad' },
        graygreen: { left: '#eeeeee', right: '#28a745' },
        graypink: { left: '#eeeeee', right: '#e83e8c' },
        grayorange: { left: '#eeeeee', right: '#fd7e14' },
        grayyellow: { left: '#eeeeee', right: '#ffc107' },
        grayred: { left: '#eeeeee', right: '#dc3545' }
    };

    // 徽章样式定义
    const badgeStyles = {
        flat: {
            height: 24,
            textSize: 13,
            radius: 6
        },
        'flat-square': {
            height: 24,
            textSize: 13,
            radius: 0
        },
        plastic: {
            height: 22,
            textSize: 13,
            radius: 6,
            gradient: true
        },
        'for-the-badge': {
            height: 32,
            textSize: 16,
            radius: 8,
            uppercase: true
        },
        social: {
            height: 24,
            textSize: 13,
            radius: 10
        }
    };

    // 生成配色示例
    generateColorExamples();

    // 自定义颜色复选框事件
    const customColorCheck = document.getElementById('customColorCheck');
    const customColorSection = document.getElementById('customColorSection');
    const colorSchemeSelect = document.getElementById('colorScheme');

    customColorCheck.addEventListener('change', function() {
        if (this.checked) {
            customColorSection.classList.remove('d-none');
            colorSchemeSelect.disabled = true;
        } else {
            customColorSection.classList.add('d-none');
            colorSchemeSelect.disabled = false;
        }
    });

    // 生成按钮点击事件
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.addEventListener('click', generateBadge);

    // 初始化表单值
    document.getElementById('leftText').value = '徽章';
    document.getElementById('rightText').value = '示例';

    // 生成徽章函数
    function generateBadge() {
        const leftText = document.getElementById('leftText').value || '徽章';
        const rightText = document.getElementById('rightText').value || '示例';
        const linkUrl = document.getElementById('linkUrl').value;
        const badgeStyle = document.getElementById('badgeStyle').value;
        
        let leftColor, rightColor;
        
        if (customColorCheck.checked) {
            // 使用自定义颜色
            leftColor = document.getElementById('leftColor').value;
            rightColor = document.getElementById('rightColor').value;
        } else {
            // 使用预设配色方案
            const selectedScheme = colorSchemeSelect.value;
            leftColor = colorSchemes[selectedScheme].left;
            rightColor = colorSchemes[selectedScheme].right;
        }

        // 生成SVG徽章
        const svgBadge = generateSvgBadge(leftText, rightText, leftColor, rightColor, badgeStyle);
        
        // 创建Blob和URL
        const blob = new Blob([svgBadge], {type: 'image/svg+xml'});
        const badgeUrl = URL.createObjectURL(blob);

        // 更新预览
        const badgePreview = document.getElementById('badgePreview');
        badgePreview.src = badgeUrl;
        badgePreview.classList.remove('d-none');
        
        // 显示代码区域
        document.getElementById('codeArea').classList.remove('d-none');
        
        // 更新代码
        const svgCode = svgBadge;
        
        // 使用安全的方式转换为base64
        let base64Badge;
        try {
            base64Badge = btoa(unescape(encodeURIComponent(svgBadge)));
        } catch (e) {
            console.error('Base64编码失败:', e);
            base64Badge = '';
        }
        
        let markdownCode = `![${leftText} ${rightText}](data:image/svg+xml;base64,${base64Badge})`;
        let htmlCode = `<img src="data:image/svg+xml;base64,${base64Badge}" alt="${leftText} ${rightText}">`;
        
        // 如果有链接，添加链接包装
        if (linkUrl) {
            markdownCode = `[![${leftText} ${rightText}](data:image/svg+xml;base64,${base64Badge})](${linkUrl})`;
            htmlCode = `<a href="${linkUrl}"><img src="data:image/svg+xml;base64,${base64Badge}" alt="${leftText} ${rightText}"></a>`;
        }
        
        document.getElementById('markdownCode').value = markdownCode;
        document.getElementById('htmlCode').value = htmlCode;
        document.getElementById('urlCode').value = svgCode;
        
        // 隐藏欢迎文本
        const welcomeTexts = document.querySelectorAll('#previewArea .text-muted');
        welcomeTexts.forEach(text => text.classList.add('d-none'));
    }

    // 生成SVG徽章
    function generateSvgBadge(leftText, rightText, leftColor, rightColor, styleName) {
        // 获取样式配置
        const style = badgeStyles[styleName] || badgeStyles.flat;
        
        // 处理文本大小写
        if (style.uppercase) {
            leftText = leftText.toUpperCase();
            rightText = rightText.toUpperCase();
        }
        
        // 计算文本宽度（粗略估计，每个字符约为字体大小的0.6倍）
        const charWidth = style.textSize * 0.6;
        const leftTextWidth = Math.max(leftText.length * charWidth, 10);
        const rightTextWidth = Math.max(rightText.length * charWidth, 10);
        
        // 添加内边距
        const padding = 10;
        const leftWidth = leftTextWidth + padding * 2;
        const rightWidth = rightTextWidth + padding * 2;
        const totalWidth = leftWidth + rightWidth;
        
        // 创建SVG
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${style.height}" viewBox="0 0 ${totalWidth} ${style.height}" shape-rendering="crispEdges">`;
        
        // 添加定义
        svg += '<defs>';
        
        // 如果是塑料风格，添加渐变
        if (style.gradient) {
            svg += `
            <linearGradient id="leftGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${lightenColor(leftColor, 20)}" />
                <stop offset="100%" style="stop-color:${leftColor}" />
            </linearGradient>
            <linearGradient id="rightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${lightenColor(rightColor, 20)}" />
                <stop offset="100%" style="stop-color:${rightColor}" />
            </linearGradient>`;
        }
        
        svg += '</defs>';
        
        // 使用一个组来包含所有图形元素
        svg += '<g>';
        
        // 绘制左侧矩形
        const leftFill = style.gradient ? 'url(#leftGradient)' : leftColor;
        svg += `<rect x="0" y="0" width="${leftWidth}" height="${style.height}" fill="${leftFill}" rx="${style.radius}" ry="${style.radius}"/>`;
        
        // 绘制右侧矩形
        const rightFill = style.gradient ? 'url(#rightGradient)' : rightColor;
        svg += `<rect x="${leftWidth}" y="0" width="${rightWidth}" height="${style.height}" fill="${rightFill}" rx="${style.radius}" ry="${style.radius}"/>`;
        
        // 使用一个完整的路径来处理连接处，避免出现条线
        if (style.radius > 0) {
            // 使用路径绘制一个精确的连接区域，确保圆角处平滑过渡
            svg += `<path d="M${leftWidth - style.radius},0 h${style.radius * 2} v${style.height} h-${style.radius * 2} z" fill="${leftFill}" />`;
            svg += `<path d="M${leftWidth},0 h${style.radius} v${style.height} h-${style.radius} z" fill="${rightFill}" />`;
        }
        
        svg += '</g>';
        
        // 添加文本
        const textY = Math.round(style.height / 2 + style.textSize * 0.35); // 更精确的垂直居中计算
        svg += `<text x="${leftWidth / 2}" y="${textY}" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="${style.textSize}" fill="white" text-anchor="middle">${escapeXml(leftText)}</text>`;
        svg += `<text x="${leftWidth + rightWidth / 2}" y="${textY}" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="${style.textSize}" fill="white" text-anchor="middle">${escapeXml(rightText)}</text>`;
        
        svg += '</svg>';
        return svg;
    }

    // 生成配色示例
    function generateColorExamples() {
        const colorExamplesContainer = document.getElementById('colorExamples');
        // 清空容器
        colorExamplesContainer.innerHTML = '';
        
        for (const [schemeName, colors] of Object.entries(colorSchemes)) {
            // 创建示例SVG徽章
            const exampleSvg = generateSvgBadge('示例', '徽章', colors.left, colors.right, 'flat');
            
            // 创建示例元素
            const exampleCol = document.createElement('div');
            exampleCol.className = 'color-example';
            
            // 使用Blob对象创建URL，这样更可靠
            try {
                const blob = new Blob([exampleSvg], {type: 'image/svg+xml'});
                const exampleUrl = URL.createObjectURL(blob);
                
                const exampleImg = document.createElement('img');
                exampleImg.src = exampleUrl;
                exampleImg.alt = schemeName;
                exampleImg.style.maxHeight = '48px';
                
                exampleCol.appendChild(exampleImg);
            } catch (e) {
                console.error('创建示例徽章失败:', e);
                // 创建一个占位元素
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'fallback-badge';
                fallbackDiv.textContent = '示例 | 徽章';
                exampleCol.appendChild(fallbackDiv);
            }
            
            const exampleText = document.createElement('p');
            exampleText.textContent = getSchemeDisplayName(schemeName);
            exampleCol.appendChild(exampleText);
            
            // 添加点击事件，选择该配色方案
            exampleCol.addEventListener('click', function() {
                document.getElementById('colorScheme').value = schemeName;
                // 如果自定义颜色被选中，取消选中
                if (customColorCheck.checked) {
                    customColorCheck.checked = false;
                    customColorSection.classList.add('d-none');
                    colorSchemeSelect.disabled = false;
                }
                // 添加选中效果
                document.querySelectorAll('.color-example').forEach(el => {
                    el.classList.remove('border-primary');
                });
                this.classList.add('border-primary');
            });
            
            colorExamplesContainer.appendChild(exampleCol);
        }
    }

    // 获取配色方案的显示名称
    function getSchemeDisplayName(schemeName) {
        const schemeNames = {
            blue: '蓝配色',
            purple: '紫红配色',
            green: '绿色配色',
            orange: '橙色配色',
            pink: '粉红配色',
            cyan: '青绿配色',
            yellow: '黄色配色',
            red: '红色配色',
            indigo: '靛蓝配色',
            grayblue: '灰蓝配色',
            graypurple: '灰紫配色',
            graygreen: '灰绿配色',
            graypink: '灰粉配色',
            grayorange: '灰橙配色',
            grayyellow: '灰黄配色',
            grayred: '灰红配色'
        };
        
        return schemeNames[schemeName] || schemeName;
    }
    
    // 辅助函数：转义XML特殊字符
    function escapeXml(unsafe) {
        return unsafe.replace(/[<>&'"]/g, function(c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
            return c;
        });
    }
    
    // 辅助函数：使颜色变亮
    function lightenColor(color, percent) {
        // 移除#号
        let hex = color.replace('#', '');
        
        // 转换为RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        
        // 增加亮度
        r = Math.min(255, Math.floor(r * (100 + percent) / 100));
        g = Math.min(255, Math.floor(g * (100 + percent) / 100));
        b = Math.min(255, Math.floor(b * (100 + percent) / 100));
        
        // 转回十六进制
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
});

// 复制到剪贴板函数
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    
    // 使用现代的剪贴板API
    if (navigator.clipboard && window.isSecureContext) {
        // 对于textarea和input元素
        navigator.clipboard.writeText(element.value)
            .then(() => showCopySuccess(element))
            .catch(err => {
                console.error('复制失败:', err);
                // 回退到传统方法
                fallbackCopyToClipboard(element);
            });
    } else {
        // 回退到传统方法
        fallbackCopyToClipboard(element);
    }
}

// 传统的复制方法
function fallbackCopyToClipboard(element) {
    element.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(element);
        } else {
            console.error('复制命令执行失败');
        }
    } catch (err) {
        console.error('复制失败:', err);
    }
}

// 显示复制成功提示
function showCopySuccess(element) {
    const button = element.nextElementSibling;
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="bi bi-check"></i>';
    button.classList.add('btn-success');
    button.classList.remove('btn-outline-secondary');
    
    // 2秒后恢复原样
    setTimeout(function() {
        button.innerHTML = originalHTML;
        button.classList.remove('btn-success');
        button.classList.add('btn-outline-secondary');
    }, 2000);
}