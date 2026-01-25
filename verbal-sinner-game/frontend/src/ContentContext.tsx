// ContentContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {
    MainlineMap,
    MomentConfig,
    ContentContextType
} from './data';
// 載入 Mainline Map (B1)
import MainlineMapJson from '../../../projects/Verbal-Sinner/企劃/moment-configs/mainline-map.json';

// 載入所有 Moment Configs (B2)
// 為了避免過長的匯入列表，並提高可讀性，我們將靜態匯入所有已知的 moment-xx.json
import M1 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-01.json';
import M2 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-02.json';
import M3 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-03.json';
import M4 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-04.json';
import M5 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-05.json';
import M6 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-06.json';
import M7 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-07.json';
import M8 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-08.json';
import M9 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-09.json';
import M10 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-10.json';
import M11 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-11.json';
import M12 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-12.json';
import M13 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-13.json';
import M14 from '../../../projects/Verbal-Sinner/企劃/moment-configs/moment-14.json';


const initialContext: ContentContextType = {
    mainlineMap: null,
    momentConfigs: {},
    isLoading: true,
    isError: false,
    error: null,
    loadContent: async () => { }, // 佔位符
};

const ContentContext = createContext<ContentContextType>(initialContext);

export const useContent = () => useContext(ContentContext);

// 將所有 Moment Configs 映射為一個物件 { momentId: MomentConfig }
const ALL_MOMENT_CONFIGS: { [key: number]: MomentConfig } = {
    1: M1 as MomentConfig,
    2: M2 as MomentConfig,
    3: M3 as MomentConfig,
    4: M4 as MomentConfig,
    5: M5 as MomentConfig,
    6: M6 as MomentConfig,
    7: M7 as MomentConfig,
    8: M8 as MomentConfig,
    9: M9 as MomentConfig,
    10: M10 as MomentConfig,
    11: M11 as MomentConfig,
    12: M12 as MomentConfig,
    13: M13 as MomentConfig,
    14: M14 as MomentConfig,
};


export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [mainlineMap, setMainlineMap] = useState<MainlineMap | null>(null);
    const [momentConfigs, setMomentConfigs] = useState<{ [momentId: number]: MomentConfig }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadContent = async () => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            // B1: 載入 mainline-map.json
            // 這裡進行類型斷言，因為它是靜態 JSON 導入
            const map = MainlineMapJson as MainlineMap;

            // B2: 載入 moment-configs (從靜態匯入的物件中提取)
            const requiredSourceIds = new Set<number>();
            map.moments.forEach(m => {
                m.sourceMomentIds.forEach(id => requiredSourceIds.add(id));
            });

            const loadedConfigs: { [momentId: number]: MomentConfig } = {};
            let missingIds: number[] = [];

            requiredSourceIds.forEach(id => {
                const config = ALL_MOMENT_CONFIGS[id];
                if (!config) {
                    missingIds.push(id);
                }
                // 為了安全，即使找不到，我們也不會在 production 中失敗，但目前是開發階段，所以如果缺少，我們應該拋出錯誤
                loadedConfigs[id] = config;
            });

            if (missingIds.length > 0) {
                // 這是一個嚴重的配置錯誤，應拋出以觸發錯誤邊界
                throw new Error(`缺少 Moment 配置檔案: ID ${missingIds.join(', ')}。請確認 projects/Verbal-Sinner/企劃/moment-configs/ 中所有 moment-01.json 到 moment-14.json 都存在。`);
            }

            setMainlineMap(map);
            setMomentConfigs(loadedConfigs);
            console.log('✅ 內容配置載入成功');

        } catch (e: any) {
            console.error('❌ 內容配置載入失敗:', e);
            setIsError(true);
            setError(`內容載入失敗。請確認配置檔案完整性。錯誤詳情: ${e.message || '未知錯誤'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 啟動時自動載入
    useEffect(() => {
        loadContent();
    }, []);

    const contextValue: ContentContextType = {
        mainlineMap,
        momentConfigs,
        isLoading: isLoading && !isError, // 載入中且無錯誤才顯示載入畫面
        isError,
        error,
        loadContent
    };

    if (isError) {
        // 錯誤處理：如果配置載入失敗，顯示友善錯誤訊息
        return <div style={{ padding: '40px', color: '#ff3333', textAlign: 'center', fontSize: '18px', border: '1px solid #ff3333', margin: '20px' }}>
            ⛔ 故事內容載入失敗
            <p style={{ fontSize: '14px', marginTop: '10px', whiteSpace: 'pre-wrap' }}>{error}</p>
        </div>;
    }

    if (isLoading) {
        // 載入中畫面 (B1 & B2 載入狀態)
        return <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px' }}>
            正在整理檔案...
        </div>;
    }

    return (
        <ContentContext.Provider value={contextValue}>
            {children}
        </ContentContext.Provider>
    );
};
