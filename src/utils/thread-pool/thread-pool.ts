import { ThreadPool } from './thread-pool/thread-pool';
import { ThreadPoolSingle } from './thread-pool/thread-pool-single';
import { ThreadPoolMulity } from './thread-pool/thread-pool-mulity';

export { ThreadPool } from './thread-pool/thread-pool';
export { ThreadPoolSingle } from './thread-pool/thread-pool-single';
export { ThreadPoolMulity } from './thread-pool/thread-pool-mulity';

// const WorkingPool: ThreadPool = new ThreadPoolSingle();
const WorkingPool: ThreadPool = new ThreadPoolMulity();

export { WorkingPool };
