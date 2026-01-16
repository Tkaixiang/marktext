import GeneralIcon from '@/assets/icons/pref_general.svg'
import EditorIcon from '@/assets/icons/pref_editor.svg'
import MarkdownIcon from '@/assets/icons/pref_markdown.svg'
import ThemeIcon from '@/assets/icons/pref_theme.svg'
import ImageIcon from '@/assets/icons/pref_image.svg'
import SpellIcon from '@/assets/icons/pref_spellcheck.svg'
import KeyBindingIcon from '@/assets/icons/pref_key_binding.svg'
import ExperimentalIcon from '@/assets/icons/pref_experimental.svg'

import preferences from '../../../../main/preferences/schema.json'
import { t } from '../../i18n'

export const getCategory = () => [
  {
    name: t('preferences.categories.general'),
    label: 'general',
    icon: GeneralIcon,
    path: '/preference/general'
  },
  {
    name: t('preferences.categories.editor'),
    label: 'editor',
    icon: EditorIcon,
    path: '/preference/editor'
  },
  {
    name: t('preferences.categories.markdown'),
    label: 'markdown',
    icon: MarkdownIcon,
    path: '/preference/markdown'
  },
  {
    name: t('preferences.categories.spelling'),
    label: 'spelling',
    icon: SpellIcon,
    path: '/preference/spelling'
  },
  {
    name: t('preferences.categories.theme'),
    label: 'theme',
    icon: ThemeIcon,
    path: '/preference/theme'
  },
  {
    name: t('preferences.categories.image'),
    label: 'image',
    icon: ImageIcon,
    path: '/preference/image'
  },
  {
    name: t('preferences.categories.keybindings'),
    label: 'keybindings',
    icon: KeyBindingIcon,
    path: '/preference/keybindings'
  },
  {
    name: t('preferences.categories.experimental'),
    label: 'experimental',
    icon: ExperimentalIcon,
    path: '/preference/experimental'
  }
]

// 创建响应式的翻译映射函数
export const getTranslatedSearchContent = () => {
  // 检查当前语言设置
  let currentLanguage = 'en'
  try {
    if (window.__VUE_I18N__) {
      const g = typeof window.__VUE_I18N__.global === 'function'
        ? window.__VUE_I18N__.global()
        : window.__VUE_I18N__.global
      if (g && g.locale) currentLanguage = g.locale.value || g.locale || 'en'
    }
  } catch (e) {
    console.warn('⚠️ 无法获取当前语言设置:', e)
  }
  
  const result = Object.keys(preferences)
    .map((k) => {
      const { description, enum: emums } = preferences[k]
      let [category] = description.split('--')

      // 映射分类名称
      let mappedCategory = category.toLowerCase()
      if (category === 'General') mappedCategory = 'general'
      else if (category === 'Editor') mappedCategory = 'editor'
      else if (category === 'Markdown') mappedCategory = 'markdown'
      else if (category === 'Theme') mappedCategory = 'theme'
      else if (category === 'Image') mappedCategory = 'image'
      else if (category === 'View') mappedCategory = 'view'
      else if (category === 'Searcher') mappedCategory = 'searcher'
      else if (category === 'Watcher') mappedCategory = 'watcher'
      else if (category === 'Spelling') mappedCategory = 'spelling'
      else if (category === 'Custom CSS') mappedCategory = 'custom css'
      else {
        // 处理特殊分类名称
        mappedCategory = category.toLowerCase().replace(/\s+/g, '-')
      }

      // 计算用于路由跳转的分类（仅允许已存在的路由，否则回退到 general）
      let routeCategory = mappedCategory
      const validRoutes = ['general', 'editor', 'markdown', 'spelling', 'theme', 'image', 'keybindings', 'experimental']
      if (!validRoutes.includes(routeCategory)) routeCategory = 'general'
      
      // 尝试翻译分类和项目
      const categoryKey = `preferences.search.categories.${mappedCategory}`
      const itemKey = `preferences.search.items.${k}`

      // 翻译分类名称
      let translatedCategory = category
      const englishCategory = category
      try {
        translatedCategory = t(categoryKey)
      } catch (e) {
        console.warn(`   ⚠️ 搜索分类翻译失败: ${e.message}`)
        // 尝试fallback到preferences.categories
        try {
          const fallbackKey = `preferences.categories.${mappedCategory}`
          translatedCategory = t(fallbackKey)
        } catch (e2) {
          console.warn(`   ❌ 搜索分类fallback也失败: ${e2.message}`)
          translatedCategory = category
        }
      }
      
      // 翻译项目描述
      let translatedPreference = description.split('--')[1] || description
      const englishPreference = description.split('--')[1] || description
      try {
        translatedPreference = t(itemKey)
      } catch (e) {
        console.warn(`   ⚠️ 搜索项目翻译失败: ${e.message}`)
        // 尝试fallback到preferences.items
        try {
          const fallbackKey = `preferences.items.${k}`
          translatedPreference = t(fallbackKey)
        } catch (e2) {
          console.warn(`   ❌ 搜索项目fallback也失败: ${e2.message}`)
          translatedPreference = description.split('--')[1] || description
        }
      }
      
      return {
        key: k,
        category: translatedCategory,
        categoryEn: englishCategory,
        preference: translatedPreference,
        preferenceEn: englishPreference,
        routeCategory,
        description: description,
        enum: emums
      }
    })
    .filter((item) => {
      // 过滤掉不需要显示的项目
      const filterResult = !['customCss', 'sideBarVisibility', 'tabBarVisibility', 'sourceCodeModeEnabled', 'searchExclusions', 'searchMaxFileSize', 'searchIncludeHidden', 'searchNoIgnore', 'searchFollowSymlinks', 'watcherUsePolling'].includes(item.key)
      return filterResult
    })
  return result
}

// 添加语言变化监听器
export const setupLanguageChangeListener = () => {
  // 监听语言变化事件
  const handleLanguageChange = () => {
    // 触发搜索内容刷新
    if (window.__VUE_I18N__) {
      try {
        const g = typeof window.__VUE_I18N__.global === 'function'
          ? window.__VUE_I18N__.global()
          : window.__VUE_I18N__.global
        const currentLanguage = g && g.locale ? (g.locale.value || g.locale) : 'en'

        // 这里可以触发一个自定义事件，通知搜索组件刷新
        window.dispatchEvent(new CustomEvent('languageChanged', {
          detail: { language: currentLanguage }
        }))
      } catch (e) {
        console.warn('⚠️ 无法获取更新后的语言设置:', e)
      }
    }
  }
  
  // 监听i18n实例的语言变化
  if (window.__VUE_I18N__) {
    try {
      const i18n = window.__VUE_I18N__
      // 监听locale变化
      const g = typeof i18n.global === 'function' ? i18n.global() : i18n.global
      if (g && g.locale && g.locale.value !== undefined) {
        // 使用Vue的响应式系统监听语言变化
      }
    } catch (e) {
      console.warn('⚠️ 设置语言变化监听器失败:', e)
    }
  }
  
  // 添加定时检查机制作为备选方案
  setInterval(() => {
    try {
      if (window.__VUE_I18N__) {
        const g = typeof window.__VUE_I18N__.global === 'function'
          ? window.__VUE_I18N__.global()
          : window.__VUE_I18N__.global
        const currentLanguage = g && g.locale ? (g.locale.value || g.locale) : 'en'
        if (currentLanguage !== getTranslatedSearchContent.lastLanguage) {
          getTranslatedSearchContent.lastLanguage = currentLanguage
          handleLanguageChange()
        }
      }
    } catch (e) {
      // 忽略错误，继续检查
    }
  }, 1000) // 每秒检查一次
  
  // 记录初始语言
  try {
    if (window.__VUE_I18N__) {
      const g = typeof window.__VUE_I18N__.global === 'function'
        ? window.__VUE_I18N__.global()
        : window.__VUE_I18N__.global
      getTranslatedSearchContent.lastLanguage = g && g.locale ? (g.locale.value || g.locale) : 'en'
    }
  } catch (e) {
    getTranslatedSearchContent.lastLanguage = 'en'
  }
}

// 初始化语言变化监听器
setupLanguageChangeListener()

// 添加手动刷新函数
export const refreshSearchContent = () => {
  // 清除语言缓存，强制重新获取
  if (getTranslatedSearchContent.lastLanguage) {
    delete getTranslatedSearchContent.lastLanguage
  }

  // 触发语言变化事件
  window.dispatchEvent(new CustomEvent('languageChanged', {
    detail: { language: 'force-refresh' }
  }))

  return getTranslatedSearchContent()
}

// 创建调试弹窗（确保关闭按钮显示）
function createDebugPopup() {
  // 移除可能存在的旧弹窗
  const existingPopup = document.getElementById('debugPopup');
  if (existingPopup) {
    document.body.removeChild(existingPopup);
  }

  // 创建新弹窗
  const popup = document.createElement('div');
  popup.id = 'debugPopup';
  popup.style.cssText = `
    position: fixed;
    top: 50px;
    right: 20px;
    width: 400px;
    height: 300px;
    background: white;
    border: 2px solid #333;
    padding: 15px;
    overflow: auto;
    z-index: 10000;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
  `;
  
  // 创建标题栏和关闭按钮
  const titleBar = document.createElement('div');
  titleBar.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
  `;
  
  const title = document.createElement('h3');
  title.textContent = '🛠️ 调试信息';
  title.style.cssText = 'margin: 0; color: #333;';
  
  const closeButton = document.createElement('button');
  closeButton.textContent = '✕ 关闭';
  closeButton.style.cssText = `
    background: #ff4444;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
  `;
  
  // 添加关闭事件
  closeButton.onclick = () => {
    if (popup && popup.parentNode) {
      popup.parentNode.removeChild(popup);
    }
  };
  
  // 组装标题栏
  titleBar.appendChild(title);
  titleBar.appendChild(closeButton);
  
  // 创建内容区域
  const content = document.createElement('div');
  content.id = 'debugContent';
  
  // 组装弹窗
  popup.appendChild(titleBar);
  popup.appendChild(content);
  
  document.body.appendChild(popup);
  return popup;
}

// 获取i18n实例的通用方法（修复API访问问题）
function getI18nInstance() {
  if (!window.__VUE_I18N__) {
    return null;
  }

  const i18n = window.__VUE_I18N__;

  // 尝试不同的访问方式
  if (typeof i18n.global === 'function') {
    return i18n.global();
  } else if (i18n.global && typeof i18n.global.t === 'function') {
    return i18n.global;
  } else if (typeof i18n.t === 'function') {
    return i18n;
  } else if (i18n.$i18n && typeof i18n.$i18n.t === 'function') {
    return i18n.$i18n;
  }

  return null;
}

// 强化调试函数（修复API访问问题）
export const debugLanguageState = () => {
  // 确保弹窗存在并可见
  let popup = document.getElementById('debugPopup');
  if (!popup) {
    popup = createDebugPopup();
    popup.style.zIndex = '10000';
  }

  // 确保内容区域存在
  const debugContent = popup.querySelector('#debugContent');
  if (!debugContent) {
    const newContent = document.createElement('div');
    newContent.id = 'debugContent';
    popup.appendChild(newContent);
  }

  // 清空并添加调试信息
  debugContent.innerHTML = '<div id="debugDetails">正在加载调试信息...</div>';

  // 填充调试详情
  const details = debugContent.querySelector('#debugDetails');
  
  // 模拟延迟加载
  setTimeout(() => {
    try {
      // 显示i18n实例的详细信息
      let debugInfo = '<h4>🔍 i18n实例详细信息:</h4>';
      
      if (!window.__VUE_I18N__) {
        debugInfo += '<p style="color:red;">❌ __VUE_I18N__ 不存在</p>';
      } else {
        const i18n = window.__VUE_I18N__;
        debugInfo += `
          <p><strong>__VUE_I18N__ 类型:</strong> ${typeof i18n}</p>
          <p><strong>__VUE_I18N__ 键:</strong> ${Object.keys(i18n).slice(0, 10).join(', ')}</p>
          <p><strong>global 类型:</strong> ${typeof i18n.global}</p>
        `;
        
        // 安全地显示global信息
        try {
          if (i18n.global) {
            const globalKeys = Object.keys(i18n.global).slice(0, 5);
            debugInfo += `<p><strong>global 键:</strong> ${globalKeys.join(', ')}</p>`;
            
            // 检查是否有翻译函数
            if (typeof i18n.global.t === 'function') {
              debugInfo += '<p style="color:green;">✅ global.t 函数可用</p>';
            } else {
              debugInfo += '<p style="color:orange;">⚠️ global.t 函数不可用</p>';
            }
          }
        } catch (e) {
          debugInfo += `<p style="color:red;">❌ 检查global时出错: ${e.message}</p>`;
        }
        
        // 尝试获取i18n实例
        const i18nInstance = getI18nInstance();
        if (i18nInstance) {
          debugInfo += '<p style="color:green;">✅ 成功获取i18n实例</p>';
          
          // 获取当前语言
          let currentLanguage = 'unknown';
          if (i18nInstance.locale && i18nInstance.locale.value) {
            currentLanguage = i18nInstance.locale.value;
          } else if (i18nInstance.locale) {
            currentLanguage = i18nInstance.locale;
          }
          
          debugInfo += `<p><strong>🌍 当前语言:</strong> ${currentLanguage}</p>`;
          
          // 测试翻译
          try {
            const testTranslation = i18nInstance.t('preferences.general.window.titleBarStyle.custom');
            debugInfo += `<p><strong>🔄 测试翻译:</strong> ${testTranslation}</p>`;
          } catch (e) {
            debugInfo += `<p style="color:red;"><strong>🔄 测试翻译失败:</strong> ${e.message}</p>`;
          }
        } else {
          debugInfo += '<p style="color:red;">❌ 无法获取有效的i18n实例</p>';
        }
      }
      
      details.innerHTML = debugInfo;
    } catch (e) {
      details.innerHTML = `<p style="color:red;">❌ 调试失败: ${e.message}</p>`;
    }
  }, 500);
}
/*
// 在页面上添加调试按钮（仅开发环境显示）
if (typeof document !== 'undefined') {
  const isDev = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) ||
    (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development');
  if (isDev) {
    // 确保按钮容器存在
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'debugButtonContainer';
    buttonContainer.style.cssText = 'position:fixed;top:10px;right:10px;z-index:999;';
    
    // 创建调试按钮
    const debugButton = document.createElement('button');
    debugButton.textContent = '🛠️ 调试';
    debugButton.style.cssText = 'padding:8px 15px;margin:5px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;cursor:pointer;';
    debugButton.onclick = debugLanguageState;
    
    // 创建刷新按钮
    const refreshButton = document.createElement('button');
    refreshButton.textContent = '🔁 刷新';
    refreshButton.style.cssText = 'padding:8px 15px;margin:5px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;cursor:pointer;';
    refreshButton.onclick = () => window.dispatchEvent(new CustomEvent('languageChanged'));

    // 添加按钮到容器
    buttonContainer.appendChild(debugButton);
    buttonContainer.appendChild(refreshButton);
    
    // 添加到文档
    document.body.appendChild(buttonContainer);
  }
}
*/