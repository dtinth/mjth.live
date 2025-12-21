export const accountNameMap: Record<string, string> = {
  "Bank Interest": "ดอกเบี้ยธนาคาร",
  "Clubhouse listeners": "ผู้ฟังทาง Clubhouse",
  "JOOX ROOMS listeners": "ผู้ฟังทาง JOOX ROOMS",
  "Z cloud": "ค่าเซิร์ฟเวอร์: Z.com Cloud",
  ReadyIDC: "ค่าเซิร์ฟเวอร์: ReadyIDC",
  "Thai Data Cloud": "ค่าเซิร์ฟเวอร์: Thai Data Cloud",
  "Tencent Cloud": "ค่าเซิร์ฟเวอร์: Tencent Cloud",
  "Ruk-Com Cloud": "ค่าเซิร์ฟเวอร์: Ruk-Com",
  "Huawei Cloud": "ค่าเซิร์ฟเวอร์: Huawei Cloud",
  "Bangmod.Cloud": "ค่าเซิร์ฟเวอร์: Bangmod.Cloud",
  "Nipa Cloud": "ค่าเซิร์ฟเวอร์: Nipa Cloud",
  hostatom: "ค่าเซิร์ฟเวอร์: hostatom",
  AWS: "ค่าเซิร์ฟเวอร์: AWS",
  CloudHM: "ค่าเซิร์ฟเวอร์: CloudHM",
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
