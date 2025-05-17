const API_URL = 'https://xvjip7lr3l.execute-api.us-east-1.amazonaws.com/package/tmprsa';
const CHECK_URL = 'https://xvjip7lr3l.execute-api.us-east-1.amazonaws.com/package/tmp';



export async function fetchQueryResult(queryID, data) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        queryID: queryID,
        request: data
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`请求失败: ${response.status} - ${errorText}`);
      return null;
    }
    
    const result = await response.json();
    const check_response = await fetch(CHECK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request: data,
        response: result.response,
        signature: result.signature
      })
    });
    if (!check_response.ok) {
      const errorText = await check_response.text();
      if (check_response.status === 401) {
        try {
        const errorJson = JSON.parse(errorText);
        console.error(`${errorJson.error}`);
        } catch {
        console.error('The signature verification failed, and the error message is not in JSON format');
        }
        } else {
            console.error(`Check failed:${check_response.status} - ${errorText}`);
        }
    }
    const test = await check_response.json();
    console.log(test);
    
    // console.log(result);
    return result.response;

  } catch (error) {
    console.error('请求错误:', error);
    return null;
  }
}