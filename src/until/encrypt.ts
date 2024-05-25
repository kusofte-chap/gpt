
// 密钥对生成 http://web.chacuo.net/netrsakeypair
const PUBLICK_KEY = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n' +
  '2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ=='

export default function encrypt(value: string) {
  try {
    //@ts-ignore
    const pto = new window.JSEncrypt()
    pto.setPublicKey(PUBLICK_KEY)
    return pto.encrypt(value)
  } catch (error) {
    console.error('encrypt error: ', error)
  }
}