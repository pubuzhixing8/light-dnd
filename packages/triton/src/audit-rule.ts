export interface ScrollAuditRule {
    audit: number;// 控制滚动的检测距离
    seed: number;// 控制滚动的基值
}

export const auditRules: ScrollAuditRule[] = [
    {
        audit: 40,
        seed: 20
    },
    {
        audit: 60,
        seed: 10
    }
];
