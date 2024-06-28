export const newChatAPI = (message) => {
    // SSE URL，假设与POST URL相同，根据实际情况调整
    const url = `/chat?message=${encodeURIComponent(message)}`;

    const eventSource = new EventSource(url);

    eventSource.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log('Received data:', data);
        // 根据接收到的数据进行处理，比如更新Vue组件的状态
    };

    eventSource.onerror = function (error) {
        console.error('EventSource failed:', error);
        eventSource.close();
    };

    // 返回EventSource实例以便在其他地方可以关闭连接
    return eventSource;
};