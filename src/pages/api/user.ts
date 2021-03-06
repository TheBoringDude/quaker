import type { NextApiRequest, NextApiResponse } from 'next';
import { getLoginSession } from '@lib/auth';
import methodHandler from '@utils/middleware/method-handler';

async function user(req: NextApiRequest, res: NextApiResponse) {
  const session = await getLoginSession(req);

  return res.status(200).json({ user: session || null });
}

// there is no need to wrap this with sessionHandler
// since, it just returns the user's instance,
export default methodHandler(user, ['GET']);
