import type { MetaFunction } from "@remix-run/node";
import ChatInput from "../components/ChatInput";
// import Editor from "../components/Editor";
// import Steps from "../components/Steps";

export const meta: MetaFunction = () => {
  return [
    { title: "Volt" },
    { name: "description", content: "An app to code apps!" },
  ];
};

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const response = await fetch("http://localhost:3000/template", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Response("Failed to submit data", { status: response.status });
  }
  console.log(await response.json());
  return Response.json({ success: true });
}

export default function Index() {
  return (
    <div className="min-h-screen">
      <h1
        className="pt-4 text-4xl text-white"
        style={{
          textShadow:
            "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff00ff, 0 0 40px #ff00ff, 0 0 50px #ff00ff, 0 0 60px #ff00ff, 0 0 70px #ff00ff",
        }}
      >
        v<span className="text-purple-500 font-semibold">O</span>lt
      </h1>

      <div className="flex flex-col md:flex-row h-full gap-8 mt-4">
        <div className="flex flex-col flex-1 gap-5 z-1">
          <div className="h-[calc(100vh-200px)] overflow-y-scroll p-2">
          {/* <Steps /> */}
          <div className="rounded bg-black-2 w-full p-4 mb-4">
            SDFSDF
          </div>
          <div className="rounded bg-black-2 w-full p-4 mb-4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. In, delectus soluta! Amet fugit sequi veniam laborum odit enim eius eaque ex repellendus? Necessitatibus accusantium quis dicta, aliquid minima saepe commodi expedita natus optio quasi ullam veniam hic corporis tenetur consectetur libero mollitia molestiae pariatur repellat facilis? Hic cum eaque dolores animi minima. Natus incidunt suscipit, unde, veritatis minima animi repellendus in similique, excepturi qui earum voluptatem doloremque aperiam? Atque iure sed distinctio dicta facilis voluptatibus enim pariatur quasi, temporibus commodi. Nam sequi incidunt eum, vel, tempore deleniti fugit illo sit veniam repellat, blanditiis beatae quis quisquam rem id minima quod!
          </div>
          <div className="rounded bg-black-2 w-full p-4 mb-4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat ipsam praesentium fuga commodi itaque iusto esse, amet nesciunt iste corrupti tempore reiciendis expedita fugiat totam vero alias ipsum rem accusamus sunt atque assumenda dolores perspiciatis magnam quidem. Consequuntur possimus repellendus reiciendis iusto ut quis? Veritatis sit accusamus ad facere fugit voluptate quas, dolorum qui iure facilis officiis consequuntur architecto debitis quia suscipit labore inventore quidem reiciendis est a ipsum obcaecati pariatur dolor. Amet cupiditate facilis ducimus id, fugit blanditiis explicabo saepe dicta molestias eligendi, in recusandae expedita. Iste nihil nulla, assumenda eius laboriosam quidem excepturi tempora eum soluta beatae exercitationem ex perferendis vero voluptatum vitae eligendi adipisci expedita? Perspiciatis molestias hic placeat architecto dolorum possimus repellat natus temporibus, qui voluptatum a vel dignissimos quos facere quisquam. Minus aspernatur in natus accusantium dolore, dignissimos quo maiores, sunt alias fugiat eveniet deleniti labore, quaerat esse nisi ipsum doloremque recusandae obcaecati quia quibusdam! Est nulla placeat iusto repellendus, libero nemo corporis quasi corrupti debitis possimus deserunt ducimus eaque? Debitis, voluptatum labore? Eligendi, sequi. Incidunt sint reiciendis atque repudiandae, ullam quo. Ipsam reiciendis eos velit veniam nulla nostrum rem tenetur voluptatum cum iste incidunt id deserunt, consequuntur quia! Enim omnis doloremque quidem, cupiditate illum eveniet magnam nostrum nulla, neque error nihil suscipit aspernatur incidunt molestias esse vero similique distinctio beatae commodi quas reprehenderit pariatur quae. Ducimus, excepturi iure omnis illum qui tenetur repellendus sequi quisquam, libero quae deleniti quasi! Aspernatur accusamus quisquam vero ad, saepe rem voluptates provident facere enim, blanditiis corporis! Laudantium ipsum mollitia amet maxime dolorem voluptates alias veniam rem enim. Quos eveniet soluta laudantium magnam eligendi tempora facere, quisquam sint natus nobis, maxime libero? Provident quis, alias accusantium tempore dolore ipsam! Sunt, assumenda praesentium, ipsum nemo quae, est reprehenderit quam ex officiis consequuntur sit quis illum sapiente eligendi. Eligendi veritatis perferendis nam quas cupiditate, nostrum accusamus a aperiam, debitis, assumenda fuga harum minus natus id perspiciatis neque ad quos. Obcaecati aliquam in labore consequuntur laboriosam similique necessitatibus nisi rerum voluptates ipsa ex reiciendis architecto nobis dolorem suscipit eaque iure, esse vel. Illum, ducimus laboriosam odio similique dolore reprehenderit at esse eum repellendus ipsum. Expedita unde itaque deserunt inventore vel minus atque! Magni molestiae deleniti consectetur libero voluptates facere provident veniam, reiciendis nihil, adipisci et porro, dolorum magnam quasi similique tenetur fuga error corporis quisquam possimus molestias itaque! Fugit beatae commodi asperiores? Voluptas pariatur, consectetur, modi veritatis autem odit quis corrupti eos incidunt inventore illum ipsam atque nostrum aperiam facilis aut, molestiae quidem voluptatum itaque vel impedit? Dolor debitis itaque ducimus corporis reprehenderit ullam eligendi pariatur perferendis esse dolores! Doloremque cupiditate consectetur sed earum voluptates magnam facere numquam facilis minima nostrum architecto minus blanditiis iure maxime fuga quisquam eligendi, explicabo animi. Libero, recusandae architecto doloribus totam facere repellat voluptatum! Corrupti, quisquam aliquid ipsum veniam vel magnam eos modi distinctio voluptas, accusantium soluta cumque! Corporis magnam enim mollitia iusto alias accusamus expedita quaerat ipsa ipsam hic sequi eaque molestiae, similique veritatis facere voluptatum error distinctio doloribus unde possimus! Aspernatur aperiam cum, quia delectus quidem eligendi animi ut cupiditate rerum. Velit adipisci nisi, laudantium vero consectetur totam recusandae earum porro tempore doloribus ratione ullam eveniet repellat, maxime, voluptatibus illum atque nesciunt vitae similique rem deserunt nemo reiciendis vel. Ad quam reiciendis similique nihil saepe excepturi perferendis ex, reprehenderit laboriosam nemo suscipit, dignissimos optio expedita repudiandae accusantium maiores recusandae corporis sunt esse quos culpa vitae quod ea. Ratione eligendi ab, distinctio nulla eaque, esse ipsa officia maiores, amet dicta dolores provident hic architecto in? Vel, magnam ducimus? Nemo doloribus sed aliquid officia voluptatum nesciunt quaerat debitis quae in. Quos, illum dolor. Officiis sed atque eveniet voluptatem doloribus error recusandae voluptatum eaque ad ipsa eum incidunt adipisci porro illo, reiciendis veritatis provident dolore impedit similique non voluptatibus, facere neque? Tempore numquam voluptate quia animi ab nulla, et voluptas, doloremque dolorum quam alias saepe error, laborum possimus. Asperiores, placeat enim voluptates totam sit vitae minima amet. Repellendus maxime, sed, necessitatibus magnam ipsam vel consectetur eaque minus, fugit nam dolore non maiores in provident praesentium fugiat. Perferendis reiciendis nobis voluptate nesciunt repellat, iste mollitia non sint ullam explicabo quisquam doloremque necessitatibus numquam, minima corrupti. Eveniet amet pariatur exercitationem in adipisci. Ipsum ad maiores consequuntur facilis perspiciatis, dolorum minima sunt ipsam vel facere magnam alias. Reiciendis laudantium doloremque dolores iusto ratione mollitia praesentium iure voluptate accusamus totam neque vitae eveniet quos, nemo necessitatibus autem magnam velit? Mollitia aliquam commodi tenetur voluptatem vero rem officia atque necessitatibus doloribus consequatur facilis non, id voluptas voluptates quod, accusamus repudiandae dolorem, possimus dolores incidunt! Nam quam quas voluptatem porro. Inventore, saepe! Sequi doloribus, asperiores soluta minima quaerat assumenda vero itaque, pariatur sint perspiciatis quidem, provident officia hic laudantium deleniti. In, ratione recusandae accusamus ex obcaecati id magnam error eius nihil atque harum. Repellat, corrupti explicabo consectetur unde placeat tempore asperiores dolores debitis in deleniti sequi error molestiae mollitia at! Placeat mollitia animi ea labore rerum voluptatum magnam maxime eligendi! Praesentium deserunt illo vero fugit asperiores aspernatur, dolores nostrum velit? Fugit, dicta distinctio et iure eos voluptatum fuga inventore tempore reprehenderit tempora eaque hic explicabo repudiandae praesentium ab tenetur amet quia voluptate omnis quam? Eveniet sit sequi ad pariatur consectetur? Dolor, commodi quibusdam! Reprehenderit doloremque consequuntur tempore voluptas perferendis laboriosam numquam ullam voluptatibus cupiditate ab, corporis praesentium nihil optio maxime minus magni sequi hic sit ratione quis. Officiis architecto possimus ipsa perspiciatis at explicabo blanditiis excepturi reiciendis, aperiam qui culpa modi quam voluptas odio aliquam incidunt id autem quia! Cum illo officiis suscipit iusto assumenda aperiam accusamus rem! Nobis perferendis, nisi tempora provident incidunt velit, magnam omnis eaque asperiores adipisci modi maxime temporibus sunt quis, alias dolore eum libero illum suscipit inventore! Illum rem laudantium modi nihil quos vitae? Nam, quae ut sed neque quasi fugit non eligendi tempore, tenetur necessitatibus voluptatem dicta officia reiciendis. Atque, asperiores eius ex laudantium quasi doloremque aspernatur, libero aperiam illum animi adipisci fugit. Fugit, sequi? Nulla, officia. Odio quia saepe, corporis iste corrupti dolorem dolorum quasi beatae iure ducimus repudiandae velit nobis dolore quas vitae totam officia quibusdam?
             </div>
          </div>
          <ChatInput />
        </div>
        <div className="w-[70%] h-full p-4 right-0 ">
        <div className="">
          {/* <Editor /> */}qwsqs

        </div>
        </div>
      </div>

 
    </div>
  );
}