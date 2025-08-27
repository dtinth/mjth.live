export const accountNameMap: Record<string, string> = {
  "Bank Interest": "ดอกเบี้ยธนาคาร",
  "Clubhouse listeners": "ผู้ฟังทาง Clubhouse",
  "JOOX ROOMS listeners": "ผู้ฟังทาง JOOX ROOMS",
  "Z cloud": "ค่าเซิฟเวอร์: Z.com Cloud",
  ReadyIDC: "ค่าเซิฟเวอร์: ReadyIDC",
  "Thai Data Cloud": "ค่าเซิฟเวอร์: Thai Data Cloud",
  "Tencent Cloud": "ค่าเซิฟเวอร์: Tencent Cloud",
  "Ruk-Com Cloud": "ค่าเซิฟเวอร์: Ruk-Com",
  "Huawei Cloud": "ค่าเซิฟเวอร์: Huawei Cloud",
  "Bangmod.Cloud": "ค่าเซิฟเวอร์: Bangmod.Cloud",
  "Nipa Cloud": "ค่าเซิฟเวอร์: Nipa Cloud",
  hostatom: "ค่าเซิฟเวอร์: hostatom",
  AWS: "ค่าเซิฟเวอร์: AWS",
  CloudHM: "ค่าเซิฟเวอร์: CloudHM",
};

const notPersonAccount = new Set<string>([
  "Bank Interest",
  "Clubhouse listeners",
  "JOOX ROOMS listeners",
  "Unknown supporters",
  "Anonymous supporters",
]);

export function shouldCountAsSupporter(name: string) {
  return !notPersonAccount.has(name);
}
