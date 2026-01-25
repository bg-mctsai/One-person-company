// data.ts - 專案核心數據結構定義
// 遵循 SSOT 原則，對齊 JSON 配置和文件規範

// ========== 1. EvidenceCard 證物卡結構 (來自：projects/Verbal-Sinner/企劃/給工程/證物資料結構.md) ==========

export type EvidenceType = 'notification' | 'chat' | 'timeline' | 'document' | 'insight';
export type EvidenceRenderMode = 'text' | 'image';

export interface ChatMessage {
    from: string;
    text: string;
    at?: string; // 可選的時間戳
    isHighlight?: boolean;
}

export interface TimelineItem {
    at: string;
    action: string;
    note?: string;
    isHighlight?: boolean;
}

export interface DocumentSection {
    heading: string;
    lines: string[];
    isHighlight?: boolean;
}

export type EvidencePayload =
    | {
        type: 'notification';
        appName: string;
        sender: string;
        preview: string;
    }
    | {
        type: 'chat';
        threadName: string;
        messages: ChatMessage[];
    }
    | {
        type: 'timeline';
        title: string;
        items: TimelineItem[];
    }
    | {
        type: 'document';
        docTitle: string;
        sections: DocumentSection[];
    }
    | {
        type: 'insight';
        speaker?: string; 
        insightTags: string[]; // 例：boundary, power, manipulation, shame, dutyDumping
        excerpt?: string; 
        rationale: string; 
    };

export interface EvidenceCard {
    evidenceId: string;
    clueId: string; // 例：CLUE-01
    evidenceType: EvidenceType;
    renderMode: EvidenceRenderMode;
    occurredAt: string;
    sourceLabel: string;
    
    // 文案 keys (SSOT in 介面字串表.md)
    titleKey: string;
    summaryKey: string;
    highlightKey?: string;

    payload: EvidencePayload;
}

// ========== 2. Mainline Map 主線時刻表結構 (來自：projects/Verbal-Sinner/企劃/moment-configs/mainline-map.json) ==========

export interface MainMoment {
    mainMomentId: number; // 1-10
    date: string; // YYYY/MM/DD
    category: string; // 職場 | 辦公室霸凌延伸 | 自我
    title: string; // 時刻標題
    maxTurns: number; // 玩家最大句數
    keyNpc: string; // 關鍵 NPC
    supportNpcs: string[]; // 其他在場 NPC
    sourceMomentIds: number[]; // 對應到 moment-configs/moment-xx.json 的 ID
    clueIds: string[]; // 通關後獲得的線索 ID
    sceneCardRef: string; // M01, M02, ...
}

export interface MainlineMap {
    version: number;
    mode: string; // mainline-10
    totalMoments: number;
    moments: MainMoment[];
}

// ========== 3. Moment Config 時刻配置結構 (來自：projects/Verbal-Sinner/企劃/moment-configs/moment-01.json) ==========

export interface MomentOption {
    id: string; // rX_oY
    text: string; // 選項文案
    optionType: string; // 溫和堅持 | 順從消極 | 積極對抗
    tags: string[]; // 界線 | 控場 | 自曝弱點 等
}

export interface MomentRound {
    roundId: number;
    npcPrompt: string; // NPC 說話的原始 Prompt (包含人設/話術/情境)
    options: MomentOption[];
}

export interface SupportInterjection {
    npc: string;
    priority: number;
    when: string; // 觸發條件，例：王明哲.尊重>=60
    lineMode: 'template' | 'direct';
    templateKey: string; // 或 line
}

export interface MomentConfig {
    momentId: number;
    date: string;
    category: string;
    title: string;
    maxTurns: number;
    keyNpc: string;
    supportNpcs: string[];
    
    target: { 
        type: string; // emotion | status
        value: string | string[]; // 尊重 | 權力 (修正為可為陣列)
    };
    failHard: string[]; // 例：["許子維.警戒>=90"]
    entryOverrides?: { // 修正為可選
        [npcName: string]: { [status: string]: number }; // 例：{ "許子維": { "信任": 0 } }
    };
    clueId: string;
    seedMap: {
        [npcName: string]: string[]; // 例：{ "許子維": ["MASK", "PROBE"] }
    };
    opening: {
        speaker: string;
        mode: 'ai' | 'script';
        npcPrompt: string;
    };
    rounds: MomentRound[];
    supportInterjections: SupportInterjection[];
}

// ========== 4. 配置載入狀態 (用於 ContentContext) ==========

export interface ContentContextType {
    mainlineMap: MainlineMap | null;
    momentConfigs: { [momentId: number]: MomentConfig }; // 將 key 改為 number
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    loadContent: () => Promise<void>;
}
