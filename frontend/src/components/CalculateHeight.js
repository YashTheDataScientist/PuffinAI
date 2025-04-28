export function gaussianPlumeAverageConcentration(Q, H, sigma_z, z1, z2) {
    // 误差函数（erf）实现
    function erf(x) {
      return Math.sign(x) * Math.sqrt(1 - Math.exp(-x * x));
    }
  
    // 高斯分布在高度区间 [z1, z2] 的积分
    function gaussianIntegral(z1, z2) {
      const term1 = erf((z2 - H) / (Math.sqrt(2) * sigma_z));
      const term2 = erf((z1 - H) / (Math.sqrt(2) * sigma_z));
      return (Math.sqrt(Math.PI) / 2) * (term1 - term2);
    }
  
    // 计算浓度
    const integral = gaussianIntegral(z1, z2);
    const concentration = (Q / (Math.sqrt(2 * Math.PI) * sigma_z)) * integral;
  
    // 平均浓度
    return concentration / (z2 - z1);
  }